export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Page shell ── */
  .cp-page {
    font-family: 'DM Sans', sans-serif;
    color: #f0ede8;
    padding: 2.5rem 1.5rem 4rem;
    max-width: 860px;
    margin: 0 auto;
  }

  /* ── Step progress ── */
  .cp-progress {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 2.8rem;
  }
  .cp-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    flex: 1;
    position: relative;
  }
  .cp-step-circle {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 500;
    color: rgba(240,237,232,0.3);
    transition: all 0.25s;
    position: relative; z-index: 1;
  }
  .cp-step-circle--active {
    border-color: #ffbe3c;
    background: rgba(255,190,60,0.12);
    color: #ffbe3c;
    box-shadow: 0 0 14px rgba(255,190,60,0.22);
  }
  .cp-step-circle--done {
    border-color: rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.08);
    color: #4ade80;
  }
  .cp-step-label {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(240,237,232,0.28);
    white-space: nowrap;
  }
  .cp-step-label--active { color: #ffbe3c; }
  .cp-step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin-bottom: 1.4rem;
    position: relative;
  }

  /* ── Section heading ── */
  .cp-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300;
    line-height: 1.1;
    color: #f0ede8;
    margin: 0 0 0.35rem;
  }
  .cp-subheading {
    font-size: 0.75rem;
    color: rgba(240,237,232,0.35);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin: 0 0 2.4rem;
  }

  /* ── Two-column grid ── */
  .cp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 680px) {
    .cp-grid { grid-template-columns: 1fr 1fr; }
  }

  /* ── Role card ── */
  .cp-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 2.2rem 2rem;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  /* Subtle top-left glow on the card */
  .cp-card::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,190,60,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .cp-card-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(255,190,60,0.1);
    border: 1px solid rgba(255,190,60,0.18);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.6rem;
  }
  .cp-card-icon svg {
    width: 24px; height: 24px;
    color: #ffbe3c; opacity: 0.85;
  }

  .cp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-weight: 400;
    color: #f0ede8;
    margin: 0 0 0.3rem;
  }
  .cp-card-desc {
    font-size: 0.78rem;
    color: rgba(240,237,232,0.35);
    line-height: 1.5;
    margin: 0 0 1.8rem;
  }

  /* ── Role options ── */
  .cp-roles { display: flex; flex-direction: column; gap: 0.65rem; flex: 1; }

  .cp-role-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.1rem;
    border-radius: 11px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    user-select: none;
  }
  .cp-role-option:hover {
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.05);
  }
  .cp-role-option--selected {
    border-color: rgba(255,190,60,0.45);
    background: rgba(255,190,60,0.07);
    box-shadow: 0 0 0 3px rgba(255,190,60,0.06);
  }

  /* Custom radio dot */
  .cp-radio {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.18);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .cp-role-option--selected .cp-radio {
    border-color: #ffbe3c;
  }
  .cp-radio-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #ffbe3c;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s, transform 0.2s;
  }
  .cp-role-option--selected .cp-radio-dot {
    opacity: 1;
    transform: scale(1);
  }

  .cp-role-info { flex: 1; }
  .cp-role-label {
    font-size: 0.88rem;
    font-weight: 500;
    color: #f0ede8;
    margin-bottom: 0.12rem;
  }
  .cp-role-sublabel {
    font-size: 0.72rem;
    color: rgba(240,237,232,0.3);
  }

  .cp-role-badge {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.22rem 0.5rem;
    border-radius: 20px;
  }
  .cp-role-badge--approval {
    background: rgba(255,107,107,0.12);
    color: rgba(255,140,120,0.8);
    border: 1px solid rgba(255,107,107,0.2);
  }
  .cp-role-badge--instant {
    background: rgba(74,222,128,0.1);
    color: rgba(74,222,128,0.8);
    border: 1px solid rgba(74,222,128,0.18);
  }

  /* ── Next button ── */
  .cp-btn-wrap { margin-top: 1.8rem; }
  .cp-btn-primary {
    width: 100%;
    padding: 0.88rem 1.5rem;
    background: linear-gradient(135deg, #ffbe3c 0%, #ff8c00 100%);
    color: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: none; border-radius: 10px; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255,190,60,0.22);
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
  .cp-btn-primary:hover:not(:disabled) {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(255,190,60,0.36);
  }
  .cp-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .cp-btn-primary:disabled {
    opacity: 0.28; cursor: not-allowed;
    box-shadow: none;
  }
  .cp-btn-arrow {
    transition: transform 0.2s;
  }
  .cp-btn-primary:hover:not(:disabled) .cp-btn-arrow {
    transform: translateX(3px);
  }

  /* ── Notice card ── */
  .cp-notice {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    height: fit-content;
    align-self: start;
  }
  @media (min-width: 680px) {
    .cp-notice { padding: 2.2rem; }
  }

  .cp-notice-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,190,60,0.1);
    border: 1px solid rgba(255,190,60,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cp-notice-icon svg { width: 20px; height: 20px; color: #ffbe3c; }

  .cp-notice-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: #f0ede8;
    margin: 0 0 0.5rem;
  }
  .cp-notice-body {
    font-size: 0.82rem;
    line-height: 1.65;
    color: rgba(240,237,232,0.48);
    margin: 0;
  }

  /* Separator */
  .cp-notice-sep {
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .cp-notice-steps {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .cp-notice-step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .cp-notice-num {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(240,237,232,0.4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 0.05rem;
  }
  .cp-notice-step-text {
    font-size: 0.78rem;
    line-height: 1.5;
    color: rgba(240,237,232,0.4);
  }
  .cp-notice-step-text strong {
    color: rgba(240,237,232,0.65);
    font-weight: 500;
  }
`;