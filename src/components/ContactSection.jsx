const ContactSection = () => {
  return (
    <div className="contact-section">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Nous contacter</h2>
        </div>

        <div className="contact-methods">
          <div className="contact-method">
            <div className="method-icon phone">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <div className="method-content">
              <h3>Téléphone</h3>
              <p>03.65.61.04.20</p>
              <p>02.53.35.60.40</p>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon email">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <div className="method-content">
              <h3>Email</h3>
              <p>info.xeilom@xeilom.fr</p>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon website">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="method-content">
              <h3>Site web</h3>
              <p>xeilom.fr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
