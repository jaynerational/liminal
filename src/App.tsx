import { AnimatePresence } from 'framer-motion';
import { useDecisionEngine } from './hooks/useDecisionEngine';
import { useArchive } from './hooks/useArchive';
import { Threshold } from './components/Threshold';
import { LiminalSpace } from './components/LiminalSpace';
import { FadingRitual } from './components/FadingRitual';
import { Verdict } from './components/Verdict';
import { Archive } from './components/Archive';
import type { DecisionMode } from './hooks/useDecisionEngine';

function App() {
  const {
    phase,
    state,
    enterLiminal,
    beginRitual,
    selectNextFading,
    saveOption,
    releaseOption,
    proceedToVerdict,
    getDuration,
    getPreciseDuration,
    reset,
    goToArchive,
    setPhase,
  } = useDecisionEngine();

  const { addDecision } = useArchive();

  const handleEnterLiminal = (options: string[], mode: DecisionMode) => {
    enterLiminal(options, mode);
  };

  const handleSaveDecision = async () => {
    if (state.chosen) {
      await addDecision({
        created_at: new Date(),
        options: state.options,
        released: state.released,
        kept: state.kept,
        chosen: state.chosen,
        mode: state.mode,
        duration_seconds: getDuration(),
      });
      goToArchive();
    }
  };

  const handleComplete = () => {
    proceedToVerdict();
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {phase === 'threshold' && (
          <Threshold
            key="threshold"
            onEnter={handleEnterLiminal}
            onArchive={goToArchive}
          />
        )}

        {phase === 'liminal' && (
          <LiminalSpace
            key="liminal"
            options={state.options}
            onBegin={beginRitual}
          />
        )}

        {phase === 'fading' && (
          <FadingRitual
            key="fading"
            inLimbo={state.inLimbo}
            kept={state.kept}
            currentFading={state.currentFading}
            mode={state.mode}
            onSave={saveOption}
            onRelease={releaseOption}
            onSelectNext={selectNextFading}
            onComplete={handleComplete}
          />
        )}

        {phase === 'verdict' && state.chosen && (
          <Verdict
            key="verdict"
            chosen={state.chosen}
            released={state.released}
            preciseDuration={getPreciseDuration()}
            onSave={handleSaveDecision}
            onNewDecision={reset}
          />
        )}

        {phase === 'archive' && (
          <Archive
            key="archive"
            onBack={() => setPhase('threshold')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
