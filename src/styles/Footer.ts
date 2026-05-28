export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Shell ── */
  .ft-footer {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0b;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    color: #f0ede8;
    padding: 4rem 1.5rem 2rem;
    position: relative;
    overflow: hidden;
  }

  /* Ambient top glow — mirrors the brand accent */
  .ft-footer::before {
    content: '';
    position: absolute;
    top: -120px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255,190,60,0.055) 0%, transparent 70%);
    pointer-events: none;
  }

  .ft-inner {
    max-width: 1160px;
    margin: 0 auto;
    position: relative;
  }

  /* ── Top grid ── */
  .ft-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem 2rem;
    margin-bottom: 3.5rem;
  }
  @media (min-width: 560px) {
    .ft-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .ft-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
  }

  /* ── Brand column ── */
  .ft-brand-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: #f0ede8;
    text-shadow: 0 0 28px rgba(255,200,80,0.22);
    display: block;
    margin-bottom: 0.9rem;
    text-decoration: none;
  }
  .ft-brand-desc {
    font-size: 0.8rem;
    line-height: 1.7;
    color: rgba(240,237,232,0.35);
    margin: 0 0 1.4rem;
    max-width: 240px;
  }

  /* Newsletter */
  .ft-subscribe-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(240,237,232,0.3);
    margin-bottom: 0.55rem;
    display: block;
  }
  .ft-subscribe-row {
    display: flex;
    gap: 0;
    margin-bottom: 0.65rem;
  }
  .ft-subscribe-input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-right: none;
    border-radius: 8px 0 0 8px;
    padding: 0.62rem 0.9rem;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    color: #f0ede8;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .ft-subscribe-input::placeholder { color: rgba(240,237,232,0.2); }
  .ft-subscribe-input:focus {
    border-color: rgba(255,190,60,0.4);
    background: rgba(255,255,255,0.06);
  }
  .ft-subscribe-btn {
    padding: 0.62rem 1rem;
    background: linear-gradient(135deg, #ffbe3c 0%, #ff8c00 100%);
    color: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    border: none;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    transition: opacity 0.2s;
    white-space: nowrap;
  }
  .ft-subscribe-btn:hover { opacity: 0.88; }
  .ft-privacy-note {
    font-size: 0.68rem;
    color: rgba(240,237,232,0.22);
    line-height: 1.5;
    max-width: 260px;
  }

  /* ── Link columns ── */
  .ft-col-title {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(240,237,232,0.35);
    margin: 0 0 1.1rem;
  }
  .ft-col-list {
    list-style: none;
    margin: 0; padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .ft-col-link {
    font-size: 0.82rem;
    color: rgba(240,237,232,0.4);
    text-decoration: none;
    transition: color 0.18s;
    display: inline-block;
  }
  .ft-col-link:hover { color: #f0ede8; }

  /* Social links with icon pills */
  .ft-social-link {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.82rem;
    color: rgba(240,237,232,0.4);
    text-decoration: none;
    transition: color 0.18s;
  }
  .ft-social-link:hover { color: #f0ede8; }
  .ft-social-link:hover .ft-social-icon { border-color: rgba(255,190,60,0.35); background: rgba(255,190,60,0.08); }
  .ft-social-icon {
    width: 26px; height: 26px;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.18s, background 0.18s;
  }
  .ft-social-icon svg {
    width: 12px; height: 12px;
    fill: currentColor;
    opacity: 0.7;
  }

  /* ── Divider ── */
  .ft-sep {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin-bottom: 1.8rem;
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  @media (min-width: 680px) {
    .ft-bottom {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .ft-copyright {
    font-size: 0.75rem;
    color: rgba(240,237,232,0.22);
  }
  .ft-copyright span {
    color: rgba(255,190,60,0.55);
  }

  .ft-legal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.4rem;
  }
  .ft-legal-link {
    font-size: 0.75rem;
    color: rgba(240,237,232,0.25);
    text-decoration: none;
    transition: color 0.18s;
    position: relative;
  }
  .ft-legal-link::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: rgba(240,237,232,0.15);
  }
  .ft-legal-link:hover { color: rgba(240,237,232,0.6); }
`;