<script lang="ts">
  import { navigate } from '../router';

  export let FOOTER_PCT: number = 8;

  function goHome() {
    navigate('/');
  }

  function openAbout() {
    navigate('/about');
  }
</script>

<footer class="page-footer">
  <div class="footer-box">
    <nav class="footer-nav" aria-label="Enlaces">
      <a class="action" href="https://github.com/sponsors/EasyModeLife" target="_blank" rel="noopener noreferrer" title="Donar">
        Donar
      </a>
      <a class="action" href="https://github.com/EasyModeLife/RainingMath" target="_blank" rel="noopener noreferrer" title="GitHub">
        GitHub
      </a>
      <button class="action" type="button" on:click={openAbout} title="Acerca de">
        About
      </button>
    </nav>
    <p class="foot-text">Entrenamiento sin anuncios y respetuoso con tu privacidad.</p>
  </div>
</footer>

<style>
  .page-footer {
    height: var(--footer, 8%);
    width: 100vw;
    display: grid;
    place-items: center;
    background: linear-gradient(0deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.02) 100%);
    border-top: 1px solid rgba(255,255,255,.03);
    backdrop-filter: blur(6px);
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .footer-box {
    width: calc(100vw - 2rem);
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(1rem, 4vw, 2rem) clamp(1.5rem, 6vw, 3rem);
    display: grid;
    gap: clamp(1.5rem, 4vh, 3rem);
    justify-items: center;
    box-sizing: border-box;
  }

  .footer-nav {
    display: flex;
    gap: clamp(0.75rem, 3vw, 1.5rem);
    flex-wrap: wrap;
    justify-content: center;
  }

  .action {
    border: 1px solid rgba(255,255,255,.15);
    background: rgba(255,255,255,.05);
    color: var(--text);
    border-radius: 8px;
    padding: clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.8rem, 3vw, 1.2rem);
    cursor: pointer;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .action:hover {
    background: rgba(255,255,255,.1);
    border-color: rgba(255,255,255,.3);
    transform: translateY(-1px);
  }

  .action:active {
    transform: translateY(0);
  }

  .foot-text {
    margin: 0;
    font-size: clamp(0.8rem, 2.5vw, 1.1rem);
    opacity: 0.9;
    text-align: center;
    padding: 0 clamp(1rem, 5vw, 2rem);
    line-height: 1.6;
    max-width: 800px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Breakpoints responsivos mejorados */
  @media (max-width: 768px) {
    .footer-nav {
      gap: 0.5rem;
    }

    .action {
      padding: 0.45rem 0.8rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .footer-box {
      padding: 0.75rem 1rem;
      gap: 0.75rem;
    }

    .footer-nav {
      gap: 0.375rem;
    }

    .action {
      padding: 0.4rem 0.7rem;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .foot-text {
      font-size: 0.8rem;
      padding: 0 0.25rem;
      line-height: 1.5;
    }
  }

  @media (max-width: 420px) {
    .foot-text {
      font-size: 0.75rem;
      padding: 0 0.2rem;
      line-height: 1.6;
    }
  }

  @media (max-width: 360px) {
    .action {
      padding: 0.35rem 0.5rem;
      font-size: 0.75rem;
    }

    .footer-nav {
      gap: 0.25rem;
    }

    .foot-text {
      font-size: 0.75rem;
      line-height: 1.6;
    }
  }

  @media (max-width: 320px) {
    .footer-box {
      padding: 0.5rem 0.75rem;
      gap: 0.5rem;
    }

    .action {
      padding: 0.3rem 0.4rem;
      font-size: 0.7rem;
    }

    .footer-nav {
      gap: 0.2rem;
    }

    .foot-text {
      font-size: 0.7rem;
      line-height: 1.7;
      padding: 0 0.15rem;
    }
  }
</style>
