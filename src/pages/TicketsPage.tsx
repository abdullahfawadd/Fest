import { EventAbout, EventCover, EventLocation, EventTitle, RegistrationStatus } from '../components/tickets/EventContent';
import { EventDetails } from '../components/tickets/EventHosts';
import { TicketFooter } from '../components/tickets/TicketFooter';
import { TicketHeader } from '../components/tickets/TicketHeader';
import '../styles/tickets.css';

function SourceConfetti() {
  return (
    <picture className="ticket-reference-confetti" aria-hidden="true">
      <source media="(max-width: 650px)" srcSet="/assets/luma/theme/source-confetti-mobile.webp" />
      <source media="(max-width: 900px)" srcSet="/assets/luma/theme/source-confetti-tablet.webp" />
      <img src="/assets/luma/theme/source-confetti-desktop.webp" alt="" />
    </picture>
  );
}

export default function TicketsPage() {
  return (
    <div className="luma-reference">
      <div className="theme-root dark">
        <div className="luma-document">
        <div className="jsx-4084343657 jsx-2489481406 page-wrapper wide-page-wrapper">
          <a href="#main-content" className="jsx-67748f3be722da58 skip-link">{"Skip to Content"}</a>
          <TicketHeader />
          <main id="main-content" className="jsx-4084343657 jsx-2489481406 page-content">
            <div className="jsx-3a3f9598c2c3e4f4 event-theme tinted confetti confetti-dark one-to-one full-page high-contrast">
              <div className="jsx-3a3f9598c2c3e4f4 background" />
              <div className="jsx-3a3f9598c2c3e4f4 background-glow" />
              <div className="jsx-3a3f9598c2c3e4f4 background-overlay" />
              <div className="jsx-3a3f9598c2c3e4f4 background-overlay2" />
              <div className="jsx-3a3f9598c2c3e4f4 background-overlay3" />
              <div className="jsx-3a3f9598c2c3e4f4 background-overlay4" />
              <div className="jsx-43cca2dc7e5b9aeb canvas gradient-bg animate">
                <SourceConfetti />
              </div>
              <div className="jsx-3a3f9598c2c3e4f4 page-container">
                <div className="jsx-579389332 event-page-content-wrapper zm-container">
                  <div className="event-page-left">
                    <EventCover />
                    <div className="event-page-desktop-only">
                      <EventDetails />
                    </div>
                  </div>
                  <div className="event-page-right flex-1">
                    <EventTitle />
                    <RegistrationStatus />
                    <EventAbout />
                    <EventLocation />
                    <div className="event-page-mobile-only">
                      <EventDetails />
                    </div>
                  </div>
                </div>
                <TicketFooter />
              </div>
            </div>
          </main>
        </div>
        </div>
      </div>
    </div>
  );
}
