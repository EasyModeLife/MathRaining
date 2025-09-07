<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { getCalcLevel, nextCalcLevel, type CalcLevel } from './levels';
  import GameFrame from '../../components/GameFrame.svelte';
  import MathRenderer from '../../components/Math.svelte';
  import '../arithmetic/styles/trainer.css';

  const dispatch = createEventDispatcher();

  import { createProblemGenerator, type Exercise, type CalcTopic } from './problemGenerator';

  let level: CalcLevel = getCalcLevel(1)!;
  let current: Exercise;
  let input = '';
  let inputEl: HTMLInputElement | null = null;
  let correct = 0;
  let flash = false;
  let penaltyFlash = false;
  let firstProblemOfLevel = true;

  const BASE_QUESTION_TIME = 12000;
  let questionDeadline = 0;
  let remainingMs = BASE_QUESTION_TIME;
  let raf: number; let timedOutHandled = false;
  let questionShownAt = performance.now();
  let judgementLabel = '';
  let judgementColor = '';
  let judgementId = 0;
  let start = performance.now();

  $: displayCorrect = Math.max(0, correct);

  function gen(): Exercise {
    return createProblemGenerator(level.topics);
  }

  function next(){
    current = gen();
  if(firstProblemOfLevel){ questionDeadline = 0; remainingMs = current.timeMs; }
  else { questionDeadline = performance.now() + current.timeMs; remainingMs = current.timeMs; }
    timedOutHandled = false;
    questionShownAt = performance.now();
  }
  function init(){
    correct=0; input=''; flash=false; firstProblemOfLevel=true; start=performance.now();
    if (import.meta.env?.DEV) console.log('[calc] init level', level.id);
    next();
  }
  init();

  function applyAndValidate(raw:string){
    let val = raw.trim();
    input = val;
    if(!val) return;
    // Enhanced normalization for better LaTeX answer matching
    const norm = (s:string)=> {
      return s
        .replace(/\\/g,'') // Remove backslashes
        .replace(/\{(\d+)\}/g, '$1') // Unwrap single digit braces {2} -> 2
        .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2') // Convert fractions
        .replace(/\^\{(\w+)\}/g,'^$1') // Unwrap exponent braces ^{2} -> ^2
        .replace(/\^\{([^}]*)\}/g,'^$1') // Handle multi-char exponents ^{xy} -> ^xy
        .replace(/\s*([-+])\s*/g, '$1') // Normalize operator spacing
        .replace(/\s+/g,' ') // Collapse multiple spaces
        .replace(/^\+\s?/,'') // Remove leading plus
        .replace(/^-\s*0(\s|$)/,'0$1') // -0 -> 0
        .trim()
        .toLowerCase();
    };
    // Handle constant-only answers (like -2)
    const normalizedVal = norm(val);
    const normalizedAnswer = norm(current.answer);
    const isCorrect = normalizedVal === normalizedAnswer;
    if(isCorrect){
      judgementLabel = 'correct'; judgementColor = '#BCED09'; judgementId+=1; flash=true; correct+=1; dispatch('answer',{correct:true});
      const levelComplete = correct >= level.total;
      setTimeout(()=>{
        input=''; flash=false;
        if(levelComplete){
          const nxt = nextCalcLevel(level.id);
          if(nxt){ level = nxt; correct = 0; firstProblemOfLevel = true; next(); }
        } else {
          firstProblemOfLevel = false;
          next();
        }
      }, 200);
    }
  }


  function handleChange(e:Event){ applyAndValidate((e.target as HTMLInputElement).value); }
  function handleInputKey(e:KeyboardEvent){ if(e.key==='Enter'){ applyAndValidate(input); } }

  onMount(()=>{
    setTimeout(()=>inputEl?.focus(),0);
    const tick = () => {
      if(questionDeadline>0){
        remainingMs = Math.max(0, questionDeadline - performance.now());
        if(!timedOutHandled && remainingMs<=0){
          dispatch('answer', { correct: false });
          timedOutHandled = true; correct = Math.max(0, correct-1); judgementLabel='miss'; judgementColor='#FF715B'; judgementId+=1; penaltyFlash=true; setTimeout(()=>penaltyFlash=false,250);
          firstProblemOfLevel=false; input=''; flash=false; next();
        }
  } else { remainingMs = current?.timeMs ?? BASE_QUESTION_TIME; }
      raf = requestAnimationFrame(tick);
    };
    questionDeadline = 0; raf = requestAnimationFrame(tick);
  });
  onDestroy(()=> cancelAnimationFrame(raf));
</script>

{#key current.id}
<GameFrame
  title="Calculus"
  levelId={level.id}
  total={level.total}
  correct={displayCorrect}
  showTimer={!firstProblemOfLevel}
  remainingSeconds={remainingMs/1000}
  question={current.question}
  flash={flash}
  penalty={penaltyFlash}
  overlayLabel={judgementLabel}
  overlayColor={judgementColor}
  overlayTrigger={judgementId}
  bind:inputEl
  bind:input
  handleInput={handleChange}
  handleInputKey={handleInputKey}
>
  <span slot="footer-left">
    {#if !firstProblemOfLevel}
      <MathRenderer expr={`\\text{Time left: } ${(remainingMs/1000).toFixed(1)}\\text{s}`}/>
    {:else}
      <MathRenderer expr={`\\text{Get ready...}`}/>
    {/if}
  </span>
  <span slot="footer-right">Topics: {level.topics.length}</span>
</GameFrame>
{/key}
