import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';


const Home: React.FC = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    alert(`Location captured: ${position.coords.latitude}, ${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    const sendGuestAlert = () => {
        if (!location) {
            alert('Please enable location first');
            return;
        }

        if (window.confirm('Send emergency SOS alert without login?')) {
            // Redirect to guest alert page or send directly
            navigate('/emergency');
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <header className="hero-section">
                <nav className="navbar">
                    <div className="nav-container">
                        <div className="logo-container">
                          <img src={'https://i.pinimg.com/736x/4e/ff/97/4eff970c3571985e11adca42d31f792b.jpg'} alt="Silent Shield Logo" className="logo-image" />
                          <span className="logo-text">Silent Shield</span>
                        </div>
                        <div className="nav-links">
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                        <Link to="/volunteer-signup" className="nav-link volunteer-btn">Become Volunteer</Link>
                    </div>
                </div>
            </nav>

            <div className="hero-content">
                <h1 className="hero-title">Stay Safe, Stay Connected</h1>
                <p className="hero-subtitle">
                    Silent Shield is your personal safety companion. Send emergency alerts,
                    report unsafe areas, and connect with volunteers in real-time.
                </p>

                <div className="hero-buttons">
                    <button onClick={getLocation} className="hero-button primary">
                        📍 Enable Location
                    </button>
                    <button onClick={sendGuestAlert} className="hero-button emergency">
                        🚨 Emergency SOS (Guest)
                    </button>
                    <Link to="/signup" className="hero-button secondary">
                        👤 Create Account
                    </Link>
                </div>
            </div>
        </header>

      {/* Features Section */ }
    <section className="features-section">
        <h2 className="section-title">How Silent Shield Protects You</h2>

        <div className="features-grid">
            <div className="feature-card">
                <div className="feature-icon">🚨</div>
                <h3>Emergency SOS</h3>
                <p>Send instant emergency alerts with your location to nearby volunteers and authorities.</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">📍</div>
                <h3>Live Location Sharing</h3>
                <p>Share your real-time location with trusted contacts during emergencies.</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Safety Heatmap</h3>
                <p>View reported unsafe areas in your city on an interactive map.</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Volunteer Network</h3>
                <p>Connect with verified volunteers ready to help in emergencies.</p>
            </div>
        </div>
    </section>

    {/* How It Works */ }
    <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="steps-container">
            <div className="step">
                <div className="step-number">1</div>
                <h3>Sign Up</h3>
                <p>Create your account in under 2 minutes</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
                <div className="step-number">2</div>
                <h3>Enable Location</h3>
                <p>Allow location access for emergency alerts</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
                <div className="step-number">3</div>
                <h3>Stay Protected</h3>
                <p>Use SOS button when in danger</p>
            </div>
        </div>
    </section>

    {/* Emergency Section */ }
    <section className="emergency-section">
        <div className="emergency-card">
            <h2>⚠️ Immediate Emergency Help</h2>
            <p>If you're in immediate danger and need help urgently:</p>

            <div className="emergency-actions">
                <button onClick={sendGuestAlert} className="sos-big-button">
                    🚨 PRESS FOR SOS
                </button>
                <p className="emergency-note">
                    No login required. Your location will be shared with nearby volunteers.
                </p>
            </div>

            <div className="emergency-contacts">
                <h3>Emergency Contacts:</h3>
                <div className="contact-numbers">
                    <div className="contact">Police: <strong>100</strong></div>
                    <div className="contact">Ambulance: <strong>108</strong></div>
                    <div className="contact">Women Helpline: <strong>1091</strong></div>
                </div>
            </div>
        </div>
    </section>

    {/* Footer */ }
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-section">
                <h3>Silent Shield</h3>
                <p>Your safety is our priority. We're committed to creating safer communities through technology.</p>
            </div>

            <div className="footer-section">
                <h3>Quick Links</h3>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/volunteer-signup">Become Volunteer</Link>
                <a href="#privacy">Privacy Policy</a>
            </div>

            <div className="footer-section">
                <h3>Contact</h3>
                <p>Email: support@silentshield.com</p>
                <p>24/7 Helpline: 1800-XXX-XXXX</p>
            </div>
        </div>

        <div className="footer-bottom">
            <p>© 2024 Silent Shield. All rights reserved.</p>
        </div>
    </footer>
    </div >
  );
};

export default Home;