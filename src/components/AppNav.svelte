<script lang="ts">
  import { navigate } from '../router';

  export let currentPath: string;

  function navigateTo(path: string) {
    navigate(path);
  }

  $: navLinks = [
    { path: '/', label: 'Home', ariaCurrent: currentPath === '/' },
    { path: '/arithmetic', label: 'Arithmetic', ariaCurrent: currentPath.startsWith('/arithmetic') },
    { path: '/calculus', label: 'Calculus', ariaCurrent: currentPath.startsWith('/calculus') },
    { path: '/about', label: 'About', ariaCurrent: currentPath === '/about' }
  ];
</script>

<nav class="app-nav" aria-label="Main application navigation" data-component="AppNav">
  <div class="nav-container">
    <ul class="nav-list" role="list" aria-label="Main navigation links">
      {#each navLinks as link (link.path)}
        <li class="nav-item" role="listitem">
          <a
            class="nav-link"
            href={link.path}
            aria-current={link.ariaCurrent ? 'page' : undefined}
            aria-label="Go to {link.label}"
            title="{link.label} section"
            on:click|preventDefault={() => navigateTo(link.path)}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<style>
  .app-nav {
    border-bottom: 1px solid var(--border, rgba(255,255,255,.05));
    background: var(--bg-secondary, rgba(0,0,0,.05));
    display: flex;
    align-items: center;
    padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-list {
    display: flex;
    gap: clamp(1rem, 2vw, 2rem);
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-item {
    display: flex;
  }

  .nav-link {
    color: var(--text, #e6edf3);
    text-decoration: none;
    font-weight: 500;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-link:hover {
    background: var(--surface, rgba(255,255,255,.1));
    color: var(--accent, #58a6ff);
  }

  .nav-link[aria-current="page"] {
    background: var(--accent-cool, #2f52e0);
    color: white;
    font-weight: 600;
  }

  .nav-link[aria-current="page"]:hover {
    background: var(--accent-cool, #2f52e0);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .nav-list {
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
</style>
