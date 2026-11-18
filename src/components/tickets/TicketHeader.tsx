import { useEffect, useState } from 'react';

function getTime() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(now);
  const zone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'shortOffset' })
    .formatToParts(now).find((part) => part.type === 'timeZoneName')?.value;
  return zone ? time + ' ' + zone : time;
}

function LocalClock() {
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getTime()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  return <div className="time fs-sm mono-number relative">{time}</div>;
}

export function TicketHeader() {
  return (
    <header className="jsx-1502588700 nav-wrapper animated">
      <div className="jsx-1502588700 background animated mounted" />
      <nav className="jsx-1502588700 flex-center spread gap-2">
        <a aria-label="Luma Home" href="https://luma.com/" target="_self" className="lux-menu-trigger-wrapper cursor-pointer logo-wrapper">
          <div className="jsx-1502588700 logo flex-center animated wordmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 724 264" aria-hidden="true">
              <path fill="currentColor" d="M38.53 260.65H.43V27.86h38.1zm86.46 2.77c-42.25 0-66.48-22.96-66.48-63V89.33h38.1v108.28c0 23.61 8.7 32.39 32.12 32.39 30.35 0 42.73-14.54 42.73-50.17v-90.5h38.1v171.33h-36.54v-29.91c-4.99 22.98-27.12 32.67-48.03 32.67m347.2-2.77H434.4V149.87c0-22.5-7.01-30.87-25.88-30.87-24.28 0-37.11 14.45-37.11 41.79v99.86h-37.79V149.87c0-21.93-7.23-30.87-24.94-30.87-31.59 0-38.05 32.96-38.05 41.79v99.86h-38.1V89.33h36.54v29.96c6.49-21.02 27.02-33.71 47.72-33.71 20.69 0 38.09 7.9 45.64 33.71 10.13-26.76 28.35-33.71 50.15-33.71 37.88 0 59.61 18.88 59.61 51.81zm76.65 2.77c-52.62 0-61.55-33.45-61.55-50.52 0-20.1 8.83-38.21 27.93-45.55 8.41-3.11 16.52-5.43 24.84-7.1 7.33-1.47 18.64-3.03 26.91-4.17l2.73-.38c14.38-2 29.67-9.21 29.67-18.62 0-16-20.51-18.39-32.74-18.39-13.87 0-23.64 3.57-27.53 10.05-3.49 6.46-3.73 7.97-4.62 13.6l-.62 4.43h-38.1l.68-5.61c1.35-11.14 3.41-19.03 6.48-24.83 10.54-20.39 31.77-30.75 63.08-30.75 26.11 0 44.63 8.23 53.26 15.94 5.31 4.6 9.1 9.84 11.89 16.46 5.84 12.36 6.32 20.63 6.32 29.4v86.43c0 8.07.78 14.97 2.31 20.5l1.76 6.35h-38.91l-.7-4.19c-.5-2.96-.67-19.75-.88-26.23-8.99 23.61-28.27 33.18-52.21 33.18m50.53-93.72c-7.97 6.11-20.47 9.6-38.62 13.23-31.27 5.78-36.54 13.06-36.54 27.22 0 12.5 10.63 20.26 27.75 20.26 33.23 0 47.41-15.48 47.41-51.77zm124.2-105.51C688.46 64.19 660 35.73 660 .62c0 35.11-28.46 63.57-63.57 63.57 35.11 0 63.57 28.46 63.57 63.57 0-35.11 28.46-63.57 63.57-63.57" />
            </svg>
          </div>
        </a>
        <div className="jsx-1502588700 center-and-right">
          <div className="jsx-1502588700" />
          <div className="jsx-1502588700 right-wrapper min-width-0">
            <LocalClock />
            <div className="jsx-75a36a52353cb3a6 link fs-sm fw-medium min-width-0">
              <a className="min-width-0 text-ellipses" href="https://luma.com/discover">{"Discover Events"}</a>
            </div>
            <div className="jsx-75a36a52353cb3a6">
              <a className="btn lux-button flex-center small light solid variant-color-light round no-icon" href="https://luma.com/signin">
                <div className="label">{"Sign In"}</div>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
