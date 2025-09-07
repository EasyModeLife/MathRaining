<script lang="ts">
  import { navigate } from '../router';

  export let FOOTER_PCT: number = 3;

  function goHome() {
    navigate('/');
  }

  function openAbout() {
    navigate('/about');
  }
</script>

<footer class="page-footer">
  <a href="https://github.com/sponsors/EasyModeLife" target="_blank" rel="noopener noreferrer" class="footer-btn" title="Donar" aria-label="Ir a la página de donaciones">
    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>

  <a href="https://github.com/EasyModeLife/MathRaining" target="_blank" rel="noopener noreferrer" class="footer-btn" title="GitHub" aria-label="Ir al repositorio en GitHub">
    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 18c-4.51 2-5-2-7-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>

  <button class="footer-btn" type="button" on:click={openAbout} title="Acerca de" aria-label="Ir a la página Acerca de">
    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</footer>

<style>
  .page-footer {
    height: var(--footer, 5%);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(1.5rem, 4vw, 3rem);
    background: linear-gradient(0deg, rgba(0,0,0,.05) 0%, rgba(0,0,0,.01) 100%);
    border-top: 1px solid rgba(255,255,255,.02);
    backdrop-filter: blur(6px);
    box-sizing: border-box;
    padding: 0 clamp(1rem, 3vw, 2rem);
  }

  .footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(44px, 12vw, 56px);
    height: clamp(44px, 12vw, 56px);
    border-radius: 50%;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    color: var(--text, #e6edf3);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  .footer-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .footer-btn:hover::before,
  .footer-btn:focus::before {
    opacity: 1;
  }

  .footer-btn:hover,
  .footer-btn:focus {
    border-color: rgba(255,255,255,.4);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px -8px rgba(0,0,0,.4);
  }

  .icon {
    width: 65%;
    height: 65%;
    stroke-width: 1.5;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .footer-btn:hover .icon,
  .footer-btn:focus .icon {
    transform: scale(1.1);
    stroke: var(--accent-cool, #2f52e0);
  }

  .footer-btn:active {
    transform: translateY(0) scale(0.98);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .page-footer {
      gap: 1.25rem;
      padding: 0 1.5rem;
    }

    .footer-btn {
      width: 48px;
      height: 48px;
    }

    .icon {
      width: 60%;
      height: 60%;
    }
  }

  @media (max-width: 480px) {
    .page-footer {
      gap: 1rem;
      padding: 0 1rem;
    }

    .footer-btn {
      width: 44px;
      height: 44px;
    }

    .icon {
      width: 55%;
      height: 55%;
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .footer-btn,
    .icon,
    .footer-btn::before {
      transition: none;
    }

    .footer-btn:hover,
    .footer-btn:focus {
      transform: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .footer-btn {
      border-width: 2px;
      background: var(--text, #e6edf3);
      color: var(--bg, #0d1117);
    }

    .icon {
      stroke: var(--bg, #0d1117);
    }

    .footer-btn:hover,
    .footer-btn:focus {
      background: var(--accent-cool, #2f52e0);
      border-color: var(--accent-cool, #2f52e0);
    }
  }
</style>
