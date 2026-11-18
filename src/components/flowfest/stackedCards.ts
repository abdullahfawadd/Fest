import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export function initializeStackedCards(root: HTMLElement, reduceMotion: boolean) {
  const list = root.querySelector<HTMLElement>('[data-stacked-cards-list]');
  const next = root.querySelector<HTMLButtonElement>('button[data-stacked-cards="next"]');
  if (!list || !next) return;

  const originalOrder = Array.from(list.querySelectorAll<HTMLElement>('[data-stacked-cards-item]'));
  const allCards = originalOrder.map((item) => item.querySelector<HTMLElement>('[data-stacked-cards-card]')!);
  const controller = new AbortController();
  const status = document.createElement('span');
  status.className = 'flowfest-sr-only';
  status.setAttribute('role', 'status');
  next.after(status);

  let rotation = 3;
  let transitioning = false;
  let queued = false;
  let draggable: Draggable | undefined;

  function restack() {
    Array.from(list!.children).forEach((item, index) => {
      const card = item as HTMLElement;
      card.classList.toggle('is--active', index === 0);
      card.classList.toggle('is--second', index === 1);
      card.style.zIndex = String(Math.max(3 - index, 0));
      card.style.transform = `rotate(${index === 0 || index === 2 ? rotation : -rotation}deg)`;
      card.style.pointerEvents = index === 0 ? 'auto' : 'none';
    });
  }

  function attachDraggable() {
    draggable?.kill();
    const card = list!.firstElementChild!.querySelector<HTMLElement>('[data-stacked-cards-card]')!;
    draggable = Draggable.create(card, {
      type: 'x',
      cursor: 'inherit',
      activeCursor: 'inherit',
      onPress() {
        card.classList.add('is--dragging');
      },
      onRelease() {
        card.classList.remove('is--dragging');
      },
      onDrag(this: Draggable) {
        const distance = card.getBoundingClientRect().width * 1.15;
        if (Math.abs(this.x) > distance) {
          gsap.set(card, { x: Math.sign(this.x) * (distance + (Math.abs(this.x) - distance) * 0.1) });
        }
      },
      onDragEnd(this: Draggable) {
        const width = card.getBoundingClientRect().width;
        if (Math.abs(this.x) > width * 0.1) {
          flick(Math.sign(this.x), Number(gsap.getProperty(card, 'x')), Math.abs(this.x) > width * 1.15);
        } else {
          gsap.to(card, {
            x: 0,
            duration: reduceMotion ? 0 : 0.2,
            ease: 'power2.out',
            onComplete: () => this.update(),
          });
        }
      },
    })[0];
  }

  function flick(direction = Math.sign(rotation), releaseX = 0, skipExit = false) {
    if (transitioning) {
      queued = true;
      return;
    }
    const item = list!.firstElementChild as HTMLElement;
    const card = item.querySelector<HTMLElement>('[data-stacked-cards-card]')!;
    const exitX = direction * card.getBoundingClientRect().width * 1.15;
    transitioning = true;
    draggable?.disable();

    function reorder() {
      list!.append(item);
      rotation *= -1;
      restack();
      attachDraggable();
      const active = list!.firstElementChild as HTMLElement;
      const position = originalOrder.indexOf(active) + 1;
      status.textContent = `Festival photo ${position} of ${originalOrder.length}`;
      transitioning = false;
      if (queued) {
        queued = false;
        flick();
      }
    }

    function settle(from: number) {
      gsap.fromTo(card, { x: from }, { x: 0, duration: 1, ease: 'elastic.out(1,0.75)' });
    }

    if (reduceMotion) {
      gsap.set(card, { x: 0 });
      reorder();
    } else if (skipExit) {
      reorder();
      settle(releaseX);
    } else {
      gsap.fromTo(card, { x: releaseX, rotation: 0 }, {
        x: exitX,
        duration: 0.2,
        ease: 'power2.out',
        onComplete() {
          gsap.set(card, { x: 0 });
          reorder();
          settle(exitX);
        },
      });
    }
  }

  restack();
  attachDraggable();
  next.addEventListener('click', () => flick(), { signal: controller.signal });

  return () => {
    controller.abort();
    draggable?.kill();
    gsap.killTweensOf(allCards);
    gsap.set(allCards, { clearProps: 'transform,touchAction' });
    originalOrder.forEach((item) => list.append(item));
    status.remove();
  };
}
