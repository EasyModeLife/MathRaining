<script lang="ts">
  import { navigate } from '../router';
</script>

<section class="not-found-host" aria-label="Not Found">
  <div class="not-found">
    <h2>404</h2>
    <p>Page not found. <a href="/" on:click|preventDefault={() => navigate('/')}>Back to home</a>.</p>
  </div>
</section>

<style>
  .not-found-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }

  .not-found {
    padding: 2rem;
    display: grid;
    place-content: center;
    text-align: center;
    gap: 1rem;
  }

  .not-found h2 {
    margin: 0;
    font-size: 4rem;
    font-weight: 900;
    color: var(--accent-cool);
    opacity: 0.5;
  }

  .not-found p {
    margin: 0;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .not-found a {
    color: var(--accent-cool);
    text-decoration: underline;
    font-weight: 600;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .not-found {
      padding: 1.5rem 1rem;
      gap: 1rem;
    }

    .not-found h2 {
      font-size: 3rem;
    }

    .not-found p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .not-found {
      padding: 1rem 0.75rem;
    }

    .not-found h2 {
      font-size: 2.5rem;
    }

    .not-found p {
      font-size: 1rem;
    }
  }
</style>
