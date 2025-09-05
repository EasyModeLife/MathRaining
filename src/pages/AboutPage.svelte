<script lang="ts">
  import { onMount } from 'svelte';

  let AboutComp: any = null;

  // Lazy load the About component
  onMount(async () => {
    try {
      const module = await import('../About.svelte');
      AboutComp = module.default;
    } catch (error) {
      console.error('Failed to load about component:', error);
    }
  });
</script>

<section class="about-host" aria-label="About">
  {#if AboutComp}
    <svelte:component this={AboutComp} />
  {:else}
    <div class="loading">Loading...</div>
  {/if}
</section>

<style>
  .about-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }

  .loading {
    padding: 2rem;
    display: grid;
    place-items: center;
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.8;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.5; }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .loading {
      padding: 1.5rem 1rem;
      font-size: 1.1rem;
    }
  }
</style>
