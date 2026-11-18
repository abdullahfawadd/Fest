export const VIEWPORTS = [
  { name: 'Small mobile', width: 320, height: 700 },
  { name: 'Mobile', width: 360, height: 800 },
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'Large mobile', width: 430, height: 932 },
  { name: 'Tablet portrait', width: 768, height: 1024 },
  { name: 'Tablet landscape', width: 1024, height: 768 },
  { name: 'Laptop', width: 1280, height: 800 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large desktop', width: 1920, height: 1080 },
] as const;

export function viewportKey(viewport: { width: number; height: number }) {
  return `${viewport.width}x${viewport.height}`;
}

export const SECTION_VIEWPORT_WIDTHS = new Set<number>([390, 768, 1440]);

export const VISUAL_SECTIONS = {
  flowfest: ['hero', 'sponsors', 'about', 'speakers', 'activities', 'community', 'testimonials', 'faq', 'tickets', 'footer'],
  luma: ['cover', 'hosts', 'attendance', 'title', 'tickets', 'about', 'location', 'footer'],
} as const;
