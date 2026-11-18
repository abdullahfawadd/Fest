import { useLayoutEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeControls } from '../components/flowfest/controls';
import { flowFestMarkup } from '../components/flowfest/markup';
import { initializeMarquee, initializeMotion } from '../components/flowfest/motion';
import { initializeStackedCards } from '../components/flowfest/stackedCards';
import { TICKETS_PATH } from '../event';
import webflowCss from '../styles/flowfest-webflow.css?inline';
import customCss from '../styles/flowfest-custom.css?inline';
import appCss from '../styles/flowfest-application.css?inline';

const bodyAttributes = {
  'data-yt-modal-status': 'not-active',
  'data-scrolling-direction': 'down',
  'data-scrolling-started': 'false',
  'data-navigation-status': 'not-active',
  'data-theme-page': 'light',
  'data-theme-nav': 'light',
  'data-bg-nav': 'light',
};

export default function FlowFestPage() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!root.current) return;
    const element = root.current;
    const controller = new AbortController();
    const { signal } = controller;
    const body = document.body;
    const html = document.documentElement;
    const previousClass = body.className;
    const previousHeight = html.style.getPropertyValue('--vh-in-px');
    const previousAttributes = Object.keys(bodyAttributes).map((attribute) => (
      [attribute, body.getAttribute(attribute)] as const
    ));
    const stylesheet = document.createElement('style');
    stylesheet.textContent = [webflowCss, customCss, appCss].join('\n');
    document.head.append(stylesheet);
    body.classList.add('body', 'is--cursor');
    Object.entries(bodyAttributes).forEach(([attribute, value]) => body.setAttribute(attribute, value));
    let lastScroll = window.scrollY;
    const setViewportHeight = () => html.style.setProperty('--vh-in-px', `${innerHeight / 100}px`);
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight, { signal });
    window.addEventListener('scroll', () => {
      if (Math.abs(window.scrollY - lastScroll) < 50) return;
      body.dataset.scrollingDirection = window.scrollY > lastScroll ? 'down' : 'up';
      body.dataset.scrollingStarted = String(window.scrollY > 50);
      lastScroll = window.scrollY;
    }, { signal, passive: true });

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const releaseControls = initializeControls(element, signal);
    const releaseMarquee = initializeMarquee(element, reduceMotion, signal);
    const releaseCards = initializeStackedCards(element, reduceMotion);
    const releaseMotion = initializeMotion(element, reduceMotion, signal);

    return () => {
      controller.abort();
      releaseMotion();
      releaseCards?.();
      releaseMarquee();
      releaseControls();
      body.className = previousClass;
      previousAttributes.forEach(([attribute, value]) => {
        if (value === null) body.removeAttribute(attribute);
        else body.setAttribute(attribute, value);
      });
      if (previousHeight) html.style.setProperty('--vh-in-px', previousHeight);
      else html.style.removeProperty('--vh-in-px');
      stylesheet.remove();
    };
  }, []);

  function handleTicketLink(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element) || !event.target.closest('[data-ticket-link]')) return;
    event.preventDefault();
    void navigate(TICKETS_PATH);
  }

  return <div ref={root} className="flowfest-root" onClick={handleTicketLink} dangerouslySetInnerHTML={{ __html: flowFestMarkup }} />;
}
