import React from 'react';
import './ContactUsPage.css'; // Import the CSS file

function ContactUsPage() {
  return (
    <div className="contact-us">
      <div className="form-container">
        <div className="form-header">
          <h2>Contact Us</h2>
          <p>This form uses fabform.io to save form submissions.</p>
        </div>
        <form action="https://fabform.io/f/xxxxx" method="post">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first-name">First name</label>
              <input type="text" name="first-name" id="first-name" autoComplete="given-name" />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last name</label>
              <input type="text" name="last-name" id="last-name" autoComplete="family-name" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="company">Company</label>
              <input type="text" name="company" id="company" autoComplete="organization" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" autoComplete="email" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="phone-number">Phone number</label>
              <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="4"></textarea>
            </div>
            <div className="form-group full-width">
              <div className="privacy-policy">
                <input type="checkbox" id="agree" />
                <label htmlFor="agree">
                  By selecting this, you agree to our <a href="#">privacy policy</a>.
                </label>
              </div>
            </div>
          </div>
          <div className="form-submit">
            <button type="submit">Let's talk</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUsPage;
