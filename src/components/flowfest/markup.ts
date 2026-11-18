import { TICKETS_PATH } from '../../event';
import floating from './reference/floating.html?raw';
import navigation from './reference/navigation.html?raw';
import videoDialog from './reference/recap.html?raw';
import fixedSun from './reference/sunny-fixed.html?raw';
import welcome from './reference/top-wrap.html?raw';
import sponsors from './reference/logo-marquee.html?raw';
import about from './reference/about.html?raw';
import speakers from './reference/speakers.html?raw';
import activities from './reference/expect.html?raw';
import community from './reference/community.html?raw';
import testimonials from './reference/tweets.html?raw';
import faq from './reference/faq.html?raw';
import tickets from './reference/prefooter.html?raw';
import footer from './reference/footer.html?raw';

const sections = [
  fixedSun, welcome, sponsors, about, speakers, activities,
  community.replace('class="community__col-grid"', 'id="organizers" class="community__col-grid"'),
  testimonials, faq, tickets, footer,
].join('');

// The authorized, local reference fragments preserve SVG IDs and selectors used by the artwork.
export const flowFestMarkup = [
  '<span id="top" aria-hidden="true"></span>',
  '<a class="flowfest-skip" href="#main">Skip to content</a>',
  floating,
  '<main id="main" class="main" tabindex="-1">',
  navigation,
  videoDialog,
  '<div class="main-wrap">',
  sections,
  '</div></main>',
].join('').replaceAll('__TICKETS_PATH__', TICKETS_PATH);
