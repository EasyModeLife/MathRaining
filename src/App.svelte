<script lang="ts">
  import { onMount } from 'svelte';
  import { path, navigate } from './router';
  import { theme, cycleTheme, initTheme, labelForTheme } from './theme';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import MainContent from './components/MainContent.svelte';

  // Estado de ruta derivado del pathname
  let currentPath = '/';
  let flashColor = 'transparent';

  $: unsubscribe = path.subscribe((p) => {
    currentPath = p;
  });

  // Inicializa tema y accesos rápidos
  onMount(() => {
    initTheme();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unsubscribe?.();
    };
  });

  // Efecto de flash cuando hay respuesta correcta/incorrecta en el juego
  function handleAnswer(event: CustomEvent) {
    flashColor = event.detail?.correct
      ? 'rgba(188, 237, 9, 0.15)'
      : 'rgba(255, 113, 91, 0.15)';
    setTimeout(() => (flashColor = 'transparent'), 250);
  }

  // Tamaños porcentuales para header/main/footer
  const HEADER_PCT = 10; // % de la página
  const FOOTER_PCT = 5;  // % de la página
</script>

<div class="page" style={`--header:${HEADER_PCT}%;--header-pct:${HEADER_PCT}%;--footer:${FOOTER_PCT}%`}>
  <Header {currentPath} goHome={() => navigate('/')} {cycleTheme} />
  <MainContent on:answer={handleAnswer} />
  <Footer {FOOTER_PCT} />
</div>

<div class="flash-overlay" class:is-visible={flashColor !== 'transparent'} style="background-color: {flashColor}"></div>

<style>
  /* Caja principal que nunca supera el viewport */
  .page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    background: var(--bg);
    color: var(--text);
  }

  /* Overlay de feedback, limitado a main */
  .flash-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
    transition: background-color .12s ease-in-out, opacity .12s ease-in-out;
    opacity: 0;
  }

  .flash-overlay.is-visible {
    opacity: 1;
  }

  /* Reduced motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .flash-overlay {
      transition: none;
    }
  }
</style>
