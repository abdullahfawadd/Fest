import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { SECTION_VIEWPORT_WIDTHS, VIEWPORTS, VISUAL_SECTIONS, viewportKey } from '../tests/viewports';

const root = 'visual-qa';
const reportFolder = join(root, 'reports');
const appearanceThreshold = 0.1;
const targetPercent = 2;

async function listPngs(folder: string, prefix = ''): Promise<string[]> {
  try {
    const entries = await readdir(join(folder, prefix), { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
      const path = join(prefix, entry.name);
      if (entry.isDirectory()) return listPngs(folder, path);
      return entry.isFile() && entry.name.endsWith('.png') ? [path] : [];
    }));
    return nested.flat().sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

function crop(image: PNG, width: number, height: number) {
  if (image.width === width && image.height === height) return image;
  const cropped = new PNG({ width, height });
  PNG.bitblt(image, cropped, 0, 0, width, height, 0, 0);
  return cropped;
}

async function compare(path: string) {
  const [reference, local] = await Promise.all(['reference', 'local'].map(async (kind) =>
    PNG.sync.read(await readFile(join(root, kind, path))),
  ));
  const intersectionWidth = Math.min(reference.width, local.width);
  const intersectionHeight = Math.min(reference.height, local.height);
  const intersectionPixels = intersectionWidth * intersectionHeight;
  const comparedPixels = reference.width * reference.height + local.width * local.height - intersectionPixels;
  const outsideIntersection = comparedPixels - intersectionPixels;

  const intersectionDiff = new PNG({ width: intersectionWidth, height: intersectionHeight });
  const referencePixels = crop(reference, intersectionWidth, intersectionHeight).data;
  const localPixels = crop(local, intersectionWidth, intersectionHeight).data;
  const changedPixels = pixelmatch(
    referencePixels,
    localPixels,
    intersectionDiff.data,
    intersectionWidth,
    intersectionHeight,
    { threshold: appearanceThreshold, includeAA: true },
  );
  const referenceRgba = new Uint32Array(referencePixels.buffer, referencePixels.byteOffset, intersectionPixels);
  const localRgba = new Uint32Array(localPixels.buffer, localPixels.byteOffset, intersectionPixels);
  let exactMismatchedPixels = outsideIntersection;
  for (let pixel = 0; pixel < intersectionPixels; pixel += 1) {
    if (referenceRgba[pixel] !== localRgba[pixel]) exactMismatchedPixels += 1;
  }

  const diff = new PNG({
    width: Math.max(reference.width, local.width),
    height: Math.max(reference.height, local.height),
  });
  PNG.bitblt(intersectionDiff, diff, 0, 0, intersectionWidth, intersectionHeight, 0, 0);

  // Mark the union outside the shared top-left region as unpaired image area.
  if (outsideIntersection > 0) {
    for (let y = 0; y < diff.height; y += 1) {
      const start = y < intersectionHeight ? intersectionWidth : 0;
      for (let x = start; x < diff.width; x += 1) {
        if ((x < reference.width && y < reference.height) || (x < local.width && y < local.height)) {
          const channel = (y * diff.width + x) * 4;
          diff.data.writeUInt32BE(0xd727ebff, channel);
        }
      }
    }
  }

  const diffPath = join(root, 'diff', path);
  await mkdir(dirname(diffPath), { recursive: true });
  await writeFile(diffPath, PNG.sync.write(diff, { filterType: 1, deflateLevel: 3 }));

  const mismatchedPixels = changedPixels + outsideIntersection;
  const mismatchPercent = (mismatchedPixels / comparedPixels) * 100;
  return {
    path: path.replaceAll('\\', '/'),
    reference: { width: reference.width, height: reference.height },
    local: { width: local.width, height: local.height },
    changedPixels,
    unpairedPixels: outsideIntersection,
    mismatchedPixels,
    exactMismatchedPixels,
    comparedPixels,
    mismatchPercent: Number(mismatchPercent.toFixed(4)),
    meetsTarget: mismatchPercent < targetPercent,
  };
}

const [referenceFiles, localFiles] = await Promise.all([
  listPngs(join(root, 'reference')),
  listPngs(join(root, 'local')),
]);
const local = new Set(localFiles);
const reference = new Set(referenceFiles);
const comparisons = [];

// Decode and compare one pair at a time to bound memory on long full-page PNGs.
for (const path of referenceFiles) {
  if (local.has(path)) comparisons.push(await compare(path));
}

const missingLocal = referenceFiles.filter((path) => !local.has(path));
const missingReference = localFiles.filter((path) => !reference.has(path));
const missingBoth = Object.entries(VISUAL_SECTIONS).flatMap(([site, sections]) => VIEWPORTS.flatMap((viewport) => {
  const names = ['viewport.png', 'full-page.png'];
  if (SECTION_VIEWPORT_WIDTHS.has(viewport.width)) {
    names.push(...sections.map((section) => `section-${section}.png`));
  }
  return names
    .map((name) => join(site, viewportKey(viewport), name))
    .filter((path) => !local.has(path) && !reference.has(path));
}));
const report = {
  threshold: appearanceThreshold,
  targetPercent,
  comparisons,
  missingLocal,
  missingReference,
  missingBoth,
};

function dimensions(image: { width: number; height: number }) {
  return `${image.width} × ${image.height}`;
}

const markdown = [
  '# Pixelmatch results',
  '',
  `Compared ${comparisons.length} pairs. ${comparisons.filter((item) => item.meetsTarget).length} were below ${targetPercent}%.`,
  '',
  `Pixelmatch threshold ${appearanceThreshold}. Antialiasing differences are included. Red marks changed shared pixels. Purple marks pixels without a counterpart. Unpaired areas count toward the mismatch percentage. Exact differences count any RGBA value that differs, plus unpaired pixels.`,
  '',
  '| Capture | Reference | Local | Pixelmatch differences | Exact differences | Unpaired pixels | Mismatch |',
  '|---|---:|---:|---:|---:|---:|---:|',
  ...comparisons.map((item) =>
    `| ${item.path} | ${dimensions(item.reference)} | ${dimensions(item.local)} | ${item.mismatchedPixels.toLocaleString('en-GB')} | ${item.exactMismatchedPixels.toLocaleString('en-GB')} | ${item.unpairedPixels.toLocaleString('en-GB')} | ${item.mismatchPercent.toFixed(4)}% |`),
  '',
  ...[
    ['Missing local capture', missingLocal] as const,
    ['Missing reference capture', missingReference] as const,
    ['Missing both captures', missingBoth] as const,
  ].flatMap(([label, entries]) => entries.length ? [`## ${label}`, '', ...entries.map((entry) => `- ${entry.replaceAll('\\', '/')}`), ''] : []),
];

await mkdir(reportFolder, { recursive: true });
await Promise.all([
  writeFile(join(reportFolder, 'pixelmatch.json'), `${JSON.stringify(report, null, 2)}\n`),
  writeFile(join(reportFolder, 'pixelmatch.md'), markdown.join('\n')),
]);

console.log(`Compared ${comparisons.length} screenshot pairs. See ${reportFolder}.`);
if (!comparisons.length || (process.env.STRICT_VISUAL_QA === '1' &&
  (missingLocal.length || missingReference.length || missingBoth.length ||
  comparisons.some((item) => !item.meetsTarget)))) {
  process.exitCode = 1;
}
