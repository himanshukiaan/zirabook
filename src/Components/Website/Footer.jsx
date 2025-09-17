import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <img 
                src="/src/assets/newlogozirakbookk.png" 
                alt="ZirakBook" 
                style={{ height: '40px' }}
                className="mb-3"
              />
              <p className="text-muted">
                ZirakBook is a comprehensive accounting and bookkeeping software designed to streamline your business finances. 
                Manage invoices, inventory, GST returns, and financial reports with ease.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light"><FaFacebookF /></a>
                <a href="#" className="text-light"><FaTwitter /></a>
                <a href="#" className="text-light"><FaLinkedinIn /></a>
                <a href="#" className="text-light"><FaInstagram /></a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="mb-3">Features</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Accounting</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Inventory Management</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Point of Sale</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">GST Returns</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Financial Reports</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Multi-User Access</a></li>
            </ul>
          </Col>

          {/* Solutions */}
          <Col lg={2} md={6}>
            <h5 className="mb-3">Solutions</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Small Business</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Retail Stores</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Wholesale</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Manufacturing</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Service Business</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">E-commerce</a></li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={6}>
            <h5 className="mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Documentation</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Video Tutorials</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Live Chat</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Contact Support</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">System Status</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={2} md={6}>
            <h5 className="mb-3">Contact</h5>
            <div className="contact-info">
              <div className="d-flex align-items-center mb-2">
                <FaMapMarkerAlt className="me-2 text-primary" />
                <small className="text-muted">
                  123 Business Street<br />
                  Indore, MP 452001<br />
                  India
                </small>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaPhone className="me-2 text-primary" />
                <small className="text-muted">+91 98765 43210</small>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaEnvelope className="me-2 text-primary" />
                <small className="text-muted">support@zirakbook.com</small>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        {/* Bottom Footer */}
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex flex-wrap gap-3 mb-3 mb-md-0">
              <a href="#" className="text-muted text-decoration-none small">Privacy Policy</a>
              <a href="#" className="text-muted text-decoration-none small">Terms of Service</a>
              <a href="#" className="text-muted text-decoration-none small">Cookie Policy</a>
              <a href="#" className="text-muted text-decoration-none small">GDPR Compliance</a>
              <a href="#" className="text-muted text-decoration-none small">Security</a>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="text-muted">
              © 2025 ZirakBook. All rights reserved. | Made with ❤️ for businesses worldwide
            </small>
          </Col>
        </Row>

        {/* Additional Info */}
        <Row className="mt-3">
          <Col>
            <div className="text-center">
              <small className="text-muted">
                🔒 Bank-level security • 📊 Real-time reporting • 🌍 Multi-language support • 📱 Mobile responsive
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;