function expandAccordion(item: HTMLElement, active: boolean) {
  const button = item.querySelector('[data-accordion-toggle]');
  const panel = item.querySelector<HTMLElement>('.accordion-css__item-bottom');
  item.dataset.accordionStatus = active ? 'active' : 'not-active';
  button?.setAttribute('aria-expanded', String(active));
  if (panel) {
    panel.inert = !active;
    panel.setAttribute('aria-hidden', String(!active));
  }
}

export function initializeControls(root: HTMLElement, signal: AbortSignal) {
  const dialog = root.querySelector<HTMLElement>('.modal-yt');
  const player = dialog?.querySelector('iframe');
  const closeButton = dialog?.querySelector<HTMLButtonElement>('button');
  const background = root.querySelectorAll<HTMLElement>('.nav, .main-wrap');
  let opener: HTMLElement | null = null;
  let originalOverflow = '';

  function closeVideo(restoreFocus = true) {
    if (!dialog || !opener) return;
    document.body.dataset.ytModalStatus = 'not-active';
    document.body.style.overflow = originalOverflow;
    dialog.inert = true;
    dialog.setAttribute('aria-hidden', 'true');
    player?.removeAttribute('src');
    background.forEach((element) => { element.inert = false; });
    if (restoreFocus) opener.focus();
    opener = null;
  }

  function openVideo(trigger: HTMLElement) {
    if (!dialog || !player?.dataset.videoSrc) return;
    opener = trigger;
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.ytModalStatus = 'active';
    player.src = player.dataset.videoSrc;
    dialog.inert = false;
    dialog.setAttribute('aria-hidden', 'false');
    background.forEach((element) => { element.inert = true; });
    closeButton?.focus();
  }

  root.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>('[data-accordion-toggle], [data-yt-modal-toggle]');
    if (!trigger) return;

    const item = trigger.closest<HTMLElement>('[data-accordion-status]');
    if (item) {
      const active = item.dataset.accordionStatus === 'active';
      const accordion = item.closest('[data-accordion-close-siblings="true"]');
      if (!active) {
        accordion?.querySelectorAll<HTMLElement>('[data-accordion-status="active"]').forEach(
          (sibling) => expandAccordion(sibling, false),
        );
      }
      expandAccordion(item, !active);
      return;
    }

    if (trigger.dataset.ytModalToggle === 'toggle') openVideo(trigger);
    if (trigger.dataset.ytModalToggle === 'close') closeVideo();
  }, { signal });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('[data-accordion-toggle]') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      target.click();
    }

    if (opener && event.key === 'Escape') {
      event.preventDefault();
      closeVideo();
    }
    if (opener && event.key === 'Tab' && (!dialog?.contains(target) || target === closeButton && event.shiftKey)) {
      event.preventDefault();
      player?.focus();
    }
  }, { signal });

  return () => closeVideo(false);
}
