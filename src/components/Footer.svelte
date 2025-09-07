<script lang="ts">
  import { navigate } from '../router';

  function openAbout() {
    navigate('/about');
  }
</script>

<footer class="page-footer">
  <div class="footer-box">
    <a href="https://github.com/sponsors/EasyModeLife" target="_blank" rel="noopener noreferrer" class="footer-btn" title="Donar" aria-label="Ir a la página de donaciones">
      <svg class="icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path d="M10 17.5l-1.25-1.125C6.5 13.875 4 12.25 4 9.5 4 7.5 5.5 6 7.5 6c1.04 0 2.04.49 2.75 1.31C11.46 6.49 12.46 6 13.5 6 15.5 6 17 7.5 17 9.5c0 2.75-2.5 4.375-4.75 6.875L10 17.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>

    <a href="https://github.com/EasyModeLife/MathRaining" target="_blank" rel="noopener noreferrer" class="footer-btn" title="GitHub" aria-label="Ir al repositorio en GitHub">
      <svg class="icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path d="M10 1C5.58 1 2 4.58 2 9c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.14.66.66 1.13 1.72.81 2.14.62.07-.48.28-.81.51-1-1.84-.2-3.76-1.02-3.76-4.47 0-.99.35-1.8.92-2.43-.09-.22-.4-1.1.09-2.29 0 0 .76-.24 2.49.93.72-.2 1.48-.3 2.24-.3.76 0 1.52.1 2.24.3 1.73-1.17 2.49-.93 2.49-.93.49 1.19.18 2.07.09 2.29.57.63.92 1.43.92 2.43 0 3.45-1.92 4.27-3.76 4.47.3.26.56.61.56 1.23 0 .89-.01 1.61-.01 1.83 0 .21.15.46.55.38C15.71 15.53 18 12.54 18 9c0-4.42-3.58-8-8-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>

    <button class="footer-btn" type="button" on:click={openAbout} title="Acerca de" aria-label="Ir a la página Acerca de">
      <svg class="icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
        <path d="M10 13v-3M10 7h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</footer>

<style>
  .page-footer {
    height: var(--footer, 5%);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(1.5rem, 4vw, 3rem);
    background: transparent;
    border-top: 1px solid rgba(36, 179, 91, 0.02);
    backdrop-filter: blur(6px);
    box-sizing: border-box;
    padding: 0 clamp(1rem, 3vw, 2rem);
  }

  .footer-box {
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: space-evenly;
    display: flex;
    align-items: center;
    gap: clamp(1.5rem, 4vw, 3rem);
    box-sizing: border-box;
    padding: clamp(0.5rem, 1vw, 0.75rem);
    border: 1px solid var(--border);
    border-radius: 12px;
    background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    backdrop-filter: blur(4px);
  }

  .footer-btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: clamp(40px, 10.8vw, 50px);
    height: clamp(40px, 10.8vw, 50px);
    border-radius: 100%;
    background: transparent;
    border: none !important;
    padding: 0 !important;
    color: var(--text, #e6edf3);
    cursor: pointer;
    text-decoration: none;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }


  .footer-btn:hover::before,
  .footer-btn:focus::before {
    opacity: 1;
  }

  .icon {
    width: 70%;
    height: 70%;
    stroke-width: 1.2;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }



  /* Responsive adjustments */
  @media (max-width: 768px) {
    .page-footer {
      padding: 0 1.5rem;
    }

    .footer-box {
      gap: 1.25rem;
      padding: clamp(0.4rem, 1vw, 0.6rem);
    }

    .footer-btn {
      width: 43px;
      height: 43px;
    }

    .icon {
      width: 60%;
      height: 60%;
    }
  }

  @media (max-width: 480px) {
    .page-footer {
      padding: 0 1rem;
    }

    .footer-box {
      gap: 1rem;
      padding: clamp(0.3rem, 0.8vw, 0.5rem);
    }

    .footer-btn {
      width: 40px;
      height: 40px;
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
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .footer-btn {
      background: linear-gradient(135deg, var(--text, #e6edf3) 0%, rgba(255,255,255,0.9) 100%) !important;
      color: var(--bg, #0d1117) !important;
    }

    .footer-btn::before {
      content: none !important;
    }

    .icon {
      stroke: var(--bg, #0d1117) !important;
    }

    .footer-btn:hover,
    .footer-btn:focus {
      background: var(--accent-cool, #2f52e0) !important;
      color: #fff !important;
    }
  }
</style>
