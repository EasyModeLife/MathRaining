<script lang="ts">
  import { navigate } from '../router';

  export let gameType: 'arithmetic' | 'calculus';
  export let currentPath: string;

  function navigateTo(path: string) {
    navigate(path);
  }

  $: navLinks = [
    { path: `/${gameType}/game`, label: 'Game', ariaCurrent: currentPath === `/${gameType}` || currentPath === `/${gameType}/game` },
    { path: `/${gameType}/practice`, label: 'Practice', ariaCurrent: currentPath === `/${gameType}/practice` },
    { path: `/${gameType}/learning`, label: 'Learning', ariaCurrent: currentPath === `/${gameType}/learning` }
  ];
</script>

<nav class="page-subnav" aria-label="Sections of {gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'}" data-component="SubNav">
  <div class="subnav-box">
    <div class="subnav-content">
      <ul class="subnav-list" role="list" aria-label="Available sections list">
        {#each navLinks as link (link.path)}
          <li class="subnav-item" role="listitem">
            <a
              class="subnav-link"
              href={link.path}
              aria-current={link.ariaCurrent ? 'page' : undefined}
              aria-label="Go to {link.label} of {gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'}"
              title="{link.label} - {gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'} Section"
              data-section={link.label.toLowerCase()}
              on:click|preventDefault={() => navigateTo(link.path)}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<style>
  .page-subnav {
    /* Same as .page-header */
    border-bottom: 1px solid rgba(255,255,255,.05);
    background: transparent;
    display: flex;
    align-items: center;
    padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.75rem, 2vw, 1rem);
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 10;
    overflow-x: hidden;
  }

  .subnav-box {
    /* Same as .header-box */
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: 12px;
    background: transparent;
    backdrop-filter: blur(4px);
  }

  .subnav-content {
    /* Navigation content wrapper */
    width: 100%;
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 4vw, 1rem);
    box-sizing: border-box;
  }

  .subnav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-auto-flow: column;
    gap: clamp(0.25rem, 1vw, 0.5rem);
    justify-content: center;
    align-items: center;
  }

  .subnav-item {
    display: flex;
  }

  .subnav-link {
    text-decoration: none;
    color: var(--text);
    border: 1px solid var(--border);
    background: var(--surface-alt);
    padding: clamp(0.5rem, 1.5vw, 0.6rem) clamp(1rem, 2.5vw, 1.25rem);
    border-radius: 10px;
    font-size: clamp(0.95rem, 2vw, 1rem);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
    font-weight: 500;
    position: relative;
  }

  .subnav-link:hover {
    background: var(--surface-alt);
    border-color: rgba(255,255,255,.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -4px rgba(0,0,0,.15);
  }

  .subnav-link[aria-current="page"] {
    background: var(--accent-cool);
    color: white;
    border-color: var(--accent-cool);
    font-weight: 700;
    box-shadow: 0 2px 8px -2px var(--accent-cool);
  }

  .subnav-link[aria-current="page"]:hover {
    background: var(--accent-cool);
    transform: translateY(0);
    box-shadow: 0 4px 12px -4px var(--accent-cool);
  }

  /* Breakpoints altamente responsivos */
  @media (max-width: 768px) {
    .subnav-content {
      padding: 0.5rem 0.75rem;
    }

    .subnav-list {
      gap: 0.25rem;
    }

    .subnav-link {
      padding: 0.5rem 0.9rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 640px) {
    .subnav-list {
      gap: 0.2rem;
    }

    .subnav-link {
      font-size: 0.88rem;
      padding: 0.45rem 0.75rem;
      white-space: nowrap;
    }

    .subnav-link[aria-current="page"] {
      transform: scale(1.02);
    }
  }

  @media (max-width: 480px) {
    .subnav-content {
      padding: 0.4rem 0.5rem;
    }

    .subnav-link {
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
      min-height: 40px;
      display: flex;
      align-items: center;
    }
  }

  @media (max-width: 360px) {
    .subnav-link {
      font-size: 0.8rem;
      padding: 0.35rem 0.5rem;
      min-height: 36px;
    }

    .subnav-list {
      gap: 0.2rem;
    }
  }

  /* Dark mode enhancements */
  @media (prefers-color-scheme: dark) {
    .subnav-link {
      background: rgba(255,255,255,.05);
      border-color: rgba(255,255,255,.1);
    }

    .subnav-link:hover {
      background: rgba(255,255,255,.08);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .subnav-link {
      border-width: 2px;
    }

    .subnav-link[aria-current="page"] {
      border-width: 2px;
      outline: 2px solid var(--accent-cool);
      outline-offset: 2px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .subnav-link {
      transition: none;
    }

    .subnav-link:hover {
      transform: none;
    }

    .subnav-link[aria-current="page"]:hover {
      box-shadow: none;
    }
  }

  /* Touch devices optimization */
  @media (hover: none) and (pointer: coarse) {
    .subnav-link {
      min-height: 44px;
      padding: 0.5rem 1rem;
    }

    .subnav-link:hover {
      transform: none;
    }

    .subnav-link:active {
      transform: scale(0.98);
    }
  }
</style>
