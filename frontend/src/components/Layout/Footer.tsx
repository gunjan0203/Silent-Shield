import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-section">
            <div className="footer-logo">
              🛡️ Silent Shield
            </div>
            <p className="footer-description">
              Your safety is our priority. We're committed to creating safer communities through technology.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/safety-tips">Safety Tips</Link></li>
              <li><Link to="/volunteer-signup">Become Volunteer</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Emergency Contacts</h4>
            <div className="emergency-contacts">
              <div className="contact-item">
                <span className="contact-label">Police</span>
                <span className="contact-number">100</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Ambulance</span>
                <span className="contact-number">108</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Women Helpline</span>
                <span className="contact-number">1091</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Disaster Management</span>
                <span className="contact-number">108</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-middle">
          <div className="app-download">
            <h4>Download Our App</h4>
            <div className="download-buttons">
              <button className="store-btn google-play">
                <span>Get it on</span>
                <strong>Google Play</strong>
              </button>
              <button className="store-btn app-store">
                <span>Download on the</span>
                <strong>App Store</strong>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Silent Shield. All rights reserved.</p>
          <p className="footer-note">
            This service is for emergency use only. In case of immediate danger, call local emergency services.
          </p>
          <div className="footer-bottom-links">
            <Link to="/sitemap">Sitemap</Link>
            <span className="separator">•</span>
            <Link to="/cookies">Cookie Policy</Link>
            <span className="separator">•</span>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;