<script lang="ts">
  import { path } from '../router';
  import SubNav from '../components/SubNav.svelte';
  import MathRenderer from '../components/Math.svelte';

  // Reactive to path changes
  $: currentPath = $path;
  $: gameType = (currentPath.includes('/arithmetic') ? 'arithmetic' : 'calculus') as 'arithmetic' | 'calculus';
</script>

<section class="learning-host" aria-label="{gameType} instructions">
  <div class="learning-section">
    <SubNav {currentPath} {gameType} />
    <div class="learning-content">
      <div class="learning-box">
        <h2>{gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'} Instructions</h2>
        <div>
          {#if gameType === 'calculus'}
            <h3>Calculus Input Instructions</h3>

            <p>Use standard mathematical notation for answers. Examples:</p>

            <h4>For derivatives:</h4>
            <ul>
              <li> d/dx [x^2] = 2x (input: 2x or 2x^1)</li>
              <li> d/dx [5x^3 + 2x] = 15x^2 + 2 (input: 15x^2 + 2)</li>
            </ul>

            <h4>For integrals:</h4>
            <ul>
              <li> ∫ x dx = x^2/2 + C (input: x^2/2 + C or (1/2)x^2 + C)</li>
            </ul>

            <h4>For trigonometry:</h4>
            <ul>
              <li> d/dx [sin x] = cos x (input: cos x)</li>
              <li> d/dx [cos x] = -sin x (input: -sin x)</li>
            </ul>

            <h4>For differentials:</h4>
            <ul>
              <li>{ "If y = x&#94;3, at x=2: dy = 3x&#94;2 dx, y'(2)=12 (input: dy=3x&#94;2 dx, y'(2)=12)" }</li>
            </ul>

            <h5>Note:</h5>
            <ul>
              <li>{ "Use &#94; for exponents (x&#94;2) instead of {&#94;} (x{&#94;2})" }</li>
              <li>{ "No spaces in expressions for better matching, or use minimal spaces" }</li>
              <li>{ "Avoid LaTeX commands like \\cos, use cos instead" }</li>
              <li>{ "Fractions: use / (e.g. 1/2) instead of \\frac{}{}" }</li>
            </ul>
          {:else}
            <p>Instructions for arithmetic coming soon...</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .learning-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }

  .learning-section {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;
  }

  .learning-content {
    min-height: 0;
    position: relative;
  }

  .learning-box {
    padding: 2rem;
    display: grid;
    gap: 1rem;
    text-align: left;
    max-width: 650px;
    width: 100%;
    min-height: 0;
    margin: 0 auto;
  }

  .learning-box h2 {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .learning-box p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.8;
    line-height: 1.6;
  }

  .learning-box h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .learning-box h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    font-weight: 500;
  }

  .learning-box ul {
    margin: 0 0 1rem 1rem;
    padding-left: 1rem;
  }

  .learning-box li {
    margin-bottom: 0.5rem;
  }

  .learning-box code {
    background: rgba(0,0,0,0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .learning-box {
      padding: 1.5rem 1rem;
    }

    .learning-box h2 {
      font-size: 1.5rem;
    }

    .learning-box p, .learning-box li {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .learning-box {
      padding: 1.25rem 0.75rem;
    }

    .learning-box h2 {
      font-size: 1.25rem;
    }

    .learning-box p, .learning-box li {
      font-size: 0.95rem;
    }
  }
</style>
