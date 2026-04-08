import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-title">MOTOSHOP</p>
        <p className="site-footer-sub">
          Showroom xe may truc tuyen - Tu van mua xe, bao duong va ho tro giao xe.
        </p>
        <p className="site-footer-copy">
          © {new Date().getFullYear()} MOTOSHOP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
