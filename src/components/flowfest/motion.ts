import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(CustomEase, DrawSVGPlugin, ScrollTrigger, TextPlugin);
const referenceEase = CustomEase.create('flowfest-cubic', '0.625, 0.05, 0, 1');

export function initializeMarquee(root: HTMLElement, reduceMotion: boolean, signal: AbortSignal) {
  const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-css-marquee]'));
  const copies: HTMLElement[] = [];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.querySelectorAll<HTMLElement>('[data-css-marquee-list]').forEach((list) => {
        list.style.animationPlayState = isIntersecting && !reduceMotion ? 'running' : 'paused';
      });
    });
  });
  function resize() {
    containers.forEach((container) => {
      container.querySelectorAll<HTMLElement>('[data-css-marquee-list]').forEach((list) => {
        list.style.animationDuration = `${list.offsetWidth / 75}s`;
      });
    });
  }
  containers.forEach((container) => {
    container.querySelectorAll<HTMLElement>('[data-css-marquee-list]').forEach((list) => {
      const copy = list.cloneNode(true) as HTMLElement;
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      container.append(copy);
      copies.push(copy);
    });
    observer.observe(container);
  });
  resize();
  window.addEventListener('resize', resize, { signal });
  return () => {
    observer.disconnect();
    copies.forEach((copy) => copy.remove());
  };
}

export function initializeMotion(root: HTMLElement, reduceMotion: boolean, signal: AbortSignal) {
  const select = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const main = root.querySelector('main')!;
  const heroSun = root.querySelector<HTMLElement>('.welcome-sun__transform')!;
  const heroMessage = heroSun.querySelector<HTMLElement>('.chat-cloud__p')!;
  const fixedSun = root.querySelector<HTMLElement>('.sunny-fixed')!;
  const fixedBubble = fixedSun.querySelector<HTMLElement>('.chat-cloud')!;
  const fixedMessage = fixedBubble.querySelector<HTMLElement>('.chat-cloud__p')!;
  const originalMessage = heroMessage.textContent ?? '';
  const originalFixedMessage = fixedMessage.textContent ?? '';
  const skipIntro = reduceMotion || Boolean(window.location.hash) || window.scrollY > 0;

  const context = gsap.context(() => {
    gsap.set(select('.loading-screen'), { autoAlpha: 0 });
    gsap.set(fixedSun, { xPercent: -200 });
    gsap.set(fixedBubble, { autoAlpha: 0 });

    if (reduceMotion) return;

    function rainbowTimeline(selector: string, edge: number, from: boolean, duration: number, delay: number, stagger: number, scroll?: ScrollTrigger.Vars) {
      const paths = select<SVGPathElement>(`${selector} path`);
      const timeline = gsap.timeline({ scrollTrigger: scroll });
      const midpoint = Math.floor(paths.length / 2);
      for (let index = 0; index < midpoint; index += 1) {
        const tween = { drawSVG: `${edge}% ${edge}%`, duration, ease: 'power1.out' };
        const pair = [paths[index], paths[index + midpoint]];
        const position = delay + index * stagger;
        if (from) timeline.from(pair, tween, position);
        else timeline.to(pair, tween, position);
      }
    }

    function connectRainbows() {
      if (signal.aborted) return;
      const cardTrigger = {
        trigger: root.querySelector('.stacked-cards__collection')!,
        start: 'clamp(top bottom)',
        end: 'bottom top',
        scrub: 0,
      };
      rainbowTimeline('.rainbow-sides__right', 0, false, 0.75, 0.125, 0.075, cardTrigger);
      rainbowTimeline('.rainbow-sides__left', 100, false, 0.75, 0, 0.075, cardTrigger);
      rainbowTimeline('.rainbow-vertical__1', 0, true, 0.5, 0, 0.0375, {
        trigger: root.querySelector('.welcome')!,
        start: 'clamp(top bottom)',
        endTrigger: root.querySelector('.about__tile')!,
        end: 'bottom bottom',
        scrub: 0,
      });
      rainbowTimeline('.rainbow-vertical__3', 0, true, 0.5, 0, 0.075, {
        trigger: root.querySelector('.about__bottom')!,
        start: 'top bottom',
        end: 'bottom center',
        scrub: 0,
      });
    }

    ScrollTrigger.create({
      trigger: root.querySelector('.welcome__col-sun'),
      start: 'bottom top',
      endTrigger: root.querySelector('.footer')!,
      end: 'top bottom',
      onToggle: ({ isActive }) => {
        gsap.to(fixedSun, { xPercent: isActive ? 0 : -200, duration: 1.2, ease: 'expo.inOut', overwrite: true });
      },
    });

    gsap.fromTo(select('.footer .sun'), { yPercent: 50 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.footer'), start: 'top bottom', end: 'bottom bottom', scrub: true },
    });

    select('.about__tile').forEach((tile) => {
      gsap.timeline({ scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: 0 } })
        .fromTo(tile.querySelectorAll('.rotate-circle__list'), { rotate: 15 }, { rotate: -15, ease: 'none' })
        .fromTo(tile.querySelectorAll('.rotate-circle__image'), { rotate: -15 }, { rotate: 15, ease: 'none' }, '<');
    });

    if (skipIntro) {
      connectRainbows();
    } else {
      const sunBox = heroSun.getBoundingClientRect();
      gsap.set(main, { height: '100svh', overflow: 'clip' });
      gsap.set(select('.loading-screen'), { autoAlpha: 1 });
      gsap.timeline({ defaults: { ease: referenceEase } })
        .set(heroSun, { y: (innerHeight - sunBox.height) / 2 - sunBox.top })
        .set(heroMessage, { text: '...' })
        .to(select('.loading-screen'), { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0.1)
        .to(heroMessage, { text: 'Hi Friends!', duration: 0.4, ease: 'none' }, 0.6)
        .to(heroMessage, { text: '...', duration: 0.25, ease: 'none' }, 2)
        .to(heroMessage, { text: 'We are back...', duration: 0.5, ease: 'none' }, 2.25)
        .to(heroMessage, { text: '...', duration: 0.25, ease: 'none' }, 3.75)
        .to(heroMessage, { text: originalMessage, duration: 0.5, ease: 'none' }, 4)
        .to(heroSun, { y: 0, duration: 1.47 }, 3)
        .from(select('.nav-bar'), { yPercent: -102, duration: 1.47 }, 3)
        .from(select('.welcome__row-cards'), { y: '3em', autoAlpha: 0, duration: 1, ease: 'expo.out' }, 3.5)
        .from(select('.welcome__h1 > span, .welcome__h2-box-wrap'), {
          yPercent: 100, autoAlpha: 0, duration: 1, stagger: -0.025, ease: 'expo.out',
        }, 3.5025)
        .call(() => {
          gsap.set(main, { clearProps: 'height,overflow' });
          context.add(connectRainbows);
          ScrollTrigger.refresh();
        }, [], 3);
      rainbowTimeline('.rainbow-sides__right', 0, true, 2, 0.5, 0.075);
      rainbowTimeline('.rainbow-sides__left', 100, true, 2, 1, 0.075);
    }
  }, root);

  const sunToggle = fixedSun.querySelector<HTMLElement>('.sun-chat-combo');
  function showMessage() {
    gsap.set(fixedMessage, { text: '...' });
    gsap.to(fixedBubble, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.2, overwrite: true });
    gsap.to(fixedMessage, { text: originalMessage, duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.3, overwrite: true });
  }
  function hideMessage() {
    gsap.to(fixedBubble, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.3, overwrite: true });
  }
  sunToggle?.addEventListener('mouseenter', showMessage, { signal });
  sunToggle?.addEventListener('mouseleave', hideMessage, { signal });
  sunToggle?.addEventListener('click', showMessage, { signal });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !sunToggle?.contains(event.target)) hideMessage();
  }, { signal });

  const followerTargets: HTMLElement[] = [];
  if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const faces = select('[data-sunny-face]').map((element) => {
      followerTargets.push(element);
      return {
        element,
        x: gsap.quickTo(element, 'xPercent', { duration: 0.4, ease: 'power3' }),
        y: gsap.quickTo(element, 'yPercent', { duration: 0.4, ease: 'power3' }),
      };
    });
    window.addEventListener('pointermove', (event) => {
      faces.forEach(({ element, x, y }) => {
        const box = element.getBoundingClientRect();
        if (!box.width || !box.height) return;
        const offsetX = (event.clientX - box.left) / (box.width / 2) - 1;
        const offsetY = (event.clientY - box.top) / (box.height / 2) - 1;
        const distance = Math.max(1, Math.hypot(offsetX, offsetY));
        x(offsetX / distance * 66);
        y(offsetY / distance * 66);
      });
    }, { signal, passive: true });

    select('[data-sticky-cursor]').forEach((container) => {
      const target = container.querySelector<HTMLElement>('[data-sticky-cursor-target]');
      if (!target) return;
      followerTargets.push(target);
      container.addEventListener('pointermove', (event) => {
        const box = target.getBoundingClientRect();
        const currentX = Number(gsap.getProperty(target, 'x'));
        const currentY = Number(gsap.getProperty(target, 'y'));
        gsap.to(target, {
          x: event.clientX - box.left + currentX + box.width * 0.08,
          y: event.clientY - box.top + currentY + box.height * 0.4,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }, { signal });
      container.addEventListener('pointerleave', () => {
        gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: referenceEase, overwrite: 'auto' });
      }, { signal });
    });
  }

  void document.fonts.ready.then(() => {
    if (!signal.aborted) ScrollTrigger.refresh();
  });
  return () => {
    gsap.killTweensOf([fixedSun, fixedBubble, fixedMessage, ...followerTargets]);
    context.revert();
    gsap.set(followerTargets, { clearProps: 'transform' });
    heroMessage.textContent = originalMessage;
    fixedMessage.textContent = originalFixedMessage;
  };
}
