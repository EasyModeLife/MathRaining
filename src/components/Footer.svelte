<script lang="ts">
  import { navigate } from '../router';

  export let FOOTER_PCT: number = 5;

  function goHome() {
    navigate('/');
  }

  function openAbout() {
    navigate('/about');
  }
</script>

<footer class="page-footer">
  <div class="footer-container">
    <div class="footer-buttons">
      <a href="https://github.com/sponsors/EasyModeLife" target="_blank" rel="noopener noreferrer" class="footer-btn" title="Donar">
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <a href="https://github.com/EasyModeLife/RainingMath" target="_blank" rel="noopener noreferrer" class="footer-btn" title="GitHub">
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <button class="footer-btn" type="button" on:click={openAbout} title="Acerca de">
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

<!-- Texto removido según solicitud -->
  </div>
</footer>

<style>
  .page-footer {
    height: var(--footer, 5%);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(0deg, rgba(0,0,0,.05) 0%, rgba(0,0,0,.01) 100%);
    border-top: 1px solid rgba(255,255,255,.02);
    backdrop-filter: blur(6px);
    box-sizing: border-box;
  }

  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.5rem, 1vh, 1rem);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem);
    box-sizing: border-box;
  }

  .footer-buttons {
    display: flex;
    gap: clamp(1.5rem, 4vw, 3rem);
    justify-content: center;
    align-items: center;
  }

  .footer-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(36px, 10vw, 48px);
    height: clamp(36px, 10vw, 48px);
    border-radius: 50%;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1);
    color: var(--text);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
  }

  .footer-btn:hover,
  .footer-btn:focus {
    background: rgba(255,255,255,.12);
    border-color: rgba(255,255,255,.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(0,0,0,.3);
    color: var(--accent-cool);
  }

  .footer-btn:active {
    transform: translateY(0);
  }

  .icon {
    width: clamp(20px, 5vw, 28px);
    height: clamp(20px, 5vw, 28px);
    display: block;
    transition: all 0.2s ease;
  }

  .footer-btn:hover .icon,
  .footer-btn:focus .icon {
    transform: scale(1.1);
  }

  .footer-text {
    margin: 0;
    font-size: clamp(0.9rem, 3vw, 1.2rem);
    opacity: 0.8;
    text-align: center;
    line-height: 1.5;
    max-width: 600px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Responsive breakpoints optimizados */
  @media (max-width: 768px) {
    .footer-buttons {
      gap: clamp(1rem, 3vw, 2rem);
    }

    .footer-btn {
      width: clamp(36px, 9vw, 48px);
      height: clamp(36px, 9vw, 48px);
    }

    .icon {
      width: clamp(16px, 4vw, 20px);
      height: clamp(16px, 4vw, 20px);
    }
  }

  @media (max-width: 640px) {
    .footer-container {
      padding: clamp(0.75rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 2rem);
      gap: clamp(1rem, 2.5vh, 1.5rem);
    }

    .footer-buttons {
      gap: clamp(1rem, 3vw, 2rem);
    }
  }

  @media (max-width: 480px) {
    .footer-buttons {
      gap: clamp(0.75rem, 2.5vw, 1.5rem);
    }

    .footer-btn {
      width: clamp(40px, 8vw, 48px);
      height: clamp(40px, 8vw, 48px);
    }

    .icon {
      width: clamp(16px, 3.2vw, 20px);
      height: clamp(16px, 3.2vw, 20px);
    }

    .footer-text {
      font-size: clamp(0.85rem, 2.8vw, 1.1rem);
      line-height: 1.6;
    }
  }

  @media (max-width: 360px) {
    .footer-container {
      padding: clamp(1rem, 3vw, 2rem);
      gap: clamp(1rem, 3vh, 1.5rem);
    }

    .footer-buttons {
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .footer-btn {
      width: clamp(36px, 7vw, 44px);
      height: clamp(36px, 7vw, 44px);
    }

    .icon {
      width: clamp(14px, 2.8vw, 18px);
      height: clamp(14px, 2.8vw, 18px);
    }

    .footer-text {
      font-size: clamp(0.8rem, 2.5vw, 1rem);
    }
  }

  @media (max-width: 320px) {
    .footer-buttons {
      gap: clamp(0.4rem, 1.5vw, 0.8rem);
    }

    .footer-btn {
      width: 32px;
      height: 32px;
    }

    .icon {
      width: 12px;
      height: 12px;
    }
  }

  /* Dark mode enhancements para SVG */
  @media (prefers-color-scheme: dark) {
    .footer-btn {
      background: rgba(0,0,0,.05);
      border-color: rgba(255,255,255,.08);
    }

    .footer-btn:hover,
    .footer-btn:focus {
      background: rgba(0,0,0,.1);
      border-color: rgba(255,255,255,.2);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .footer-btn {
      border-width: 2px;
      background: var(--text);
      color: var(--bg);
    }

    .footer-btn:hover {
      background: var(--accent-cool);
    }
  }

  /* Print styles */
  @media print {
    .footer-btn {
      background: white !important;
      border: 1px solid #ccc !important;
      color: #333 !important;
    }
  }
</style>
