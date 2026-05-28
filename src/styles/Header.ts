export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Shell ── */
  .hd-header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    background: rgba(10, 10, 11, 0.82);
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: background 0.3s;
  }

  .hd-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  /* ── Logo ── */
  .hd-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: #f0ede8;
    text-decoration: none;
    text-shadow: 0 0 30px rgba(255, 200, 80, 0.25);
    flex-shrink: 0;
    transition: text-shadow 0.25s;
  }
  .hd-logo:hover {
    text-shadow: 0 0 40px rgba(255, 200, 80, 0.45);
  }

  /* ── Nav ── */
  .hd-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .hd-link {
    position: relative;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: rgba(240, 237, 232, 0.45);
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .hd-link:hover {
    color: rgba(240, 237, 232, 0.85);
    background: rgba(255, 255, 255, 0.05);
  }
  .hd-link--active {
    color: #f0ede8;
    background: rgba(255, 255, 255, 0.07);
  }
  /* Active underline accent */
  .hd-link--active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: #ffbe3c;
  }

  /* ── More dropdown trigger ── */
  .hd-more-wrap {
    position: relative;
  }
  .hd-more-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 400;
    color: rgba(240, 237, 232, 0.45);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .hd-more-btn:hover,
  .hd-more-btn--open {
    color: rgba(240, 237, 232, 0.85);
    background: rgba(255, 255, 255, 0.05);
  }
  .hd-chevron {
    transition: transform 0.22s ease;
    opacity: 0.6;
  }
  .hd-chevron--open { transform: rotate(180deg); }

  /* ── Dropdown menu ── */
  .hd-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 200px;
    background: #111113;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 14px;
    padding: 0.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.03);
    animation: hd-fade-in 0.18s ease;
    z-index: 200;
  }
  @keyframes hd-fade-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  .hd-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.65rem 0.9rem;
    border-radius: 9px;
    font-size: 0.82rem;
    color: rgba(240, 237, 232, 0.5);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
  }
  .hd-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f0ede8;
  }
  .hd-dropdown-item svg {
    width: 15px; height: 15px;
    opacity: 0.6;
    flex-shrink: 0;
  }
  .hd-dropdown-sep {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0.35rem 0.5rem;
  }

  /* ── Right side actions ── */
  .hd-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  /* Avatar */
  .hd-avatar-link { text-decoration: none; }
  .hd-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 190, 60, 0.1);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .hd-avatar:hover {
    border-color: rgba(255, 190, 60, 0.45);
    box-shadow: 0 0 0 3px rgba(255, 190, 60, 0.08);
  }
  .hd-avatar svg {
    width: 15px; height: 15px;
    color: rgba(255, 190, 60, 0.7);
  }

  /* User name pill */
  .hd-user-name {
    font-size: 0.78rem;
    color: rgba(240, 237, 232, 0.45);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: none;
  }
  @media (min-width: 860px) { .hd-user-name { display: block; } }

  /* Divider */
  .hd-divider {
    width: 1px; height: 22px;
    background: rgba(255, 255, 255, 0.08);
  }

  /* Logout */
  .hd-logout {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: rgba(240, 237, 232, 0.35);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .hd-logout:hover {
    color: #ff6b6b;
    border-color: rgba(255, 107, 107, 0.2);
    background: rgba(255, 107, 107, 0.06);
  }
  .hd-logout svg { width: 13px; height: 13px; }

  /* ── Mobile: hide nav labels on small screens ── */
  @media (max-width: 640px) {
    .hd-nav { display: none; }
  }
`;