import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import ScoreDisplay from './components/ScoreDisplay';
import BiasCheck from './components/BiasCheck';
import ActionPlan from './components/ActionPlan';
import Questionnaire from './components/Questionnaire';
import PreMortemCard from './components/PreMortemCard';
import ExecutionArmor from './components/ExecutionArmor';
import { parseOptions, analyzeDecision, generateActionPlan, generateFallbackPreMortem } from './utils/scoring';
import { detectDecisionType } from './utils/engine';
import { fetchAnalysisFromAPI, fetchPreMortemFromAPI } from './utils/api';
import { RefreshCw } from 'lucide-react';
import './index.css';

function App() {
  const [flowState, setFlowState] = useState('hero'); // hero | questionnaire | loading | results | loadingArmor | execution
  const [result, setResult] = useState(null);
  const [parsedOptions, setParsedOptions] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [userAnswers, setUserAnswers] = useState(null);
  const [armor, setArmor] = useState(null);

  const executeAnalysis = async (options, answers = null) => {
    setFlowState('loading');
    setIsFallback(false);
    setUserAnswers(answers);

    try {
      const dilemma = `${options.optionA} vs ${options.optionB}`;
      const llmData = await fetchAnalysisFromAPI(dilemma, answers);

      setResult(llmData);
      setActionPlan(llmData.actionPlan);
      setFlowState('results');

    } catch (error) {
      console.warn("LLM API failed. Falling back to structured deterministic client-engine.");
      setIsFallback(true);
      // Fallback
      const fallbackResult = analyzeDecision(options.optionA, options.optionB, answers);
      setResult(fallbackResult);
      if (fallbackResult.recommendation !== "It's a tie. Flip a coin.") {
        setActionPlan(generateActionPlan(fallbackResult.recommendation));
      } else {
        setActionPlan(null);
      }
      setFlowState('results');
    }
  };

  const executePreMortem = async (selectedRisks) => {
    setFlowState('loadingArmor');

    try {
      const dilemma = `${parsedOptions.optionA} vs ${parsedOptions.optionB}`;
      const preMortemData = await fetchPreMortemFromAPI(dilemma, result.recommendation, userAnswers, selectedRisks);
      setArmor(preMortemData);
      setFlowState('execution');
    } catch (error) {
      console.warn("Pre-Mortem API failed. Falling back to local offline templates.");
      setArmor(generateFallbackPreMortem(selectedRisks));
      setFlowState('execution');
    }
  };

  const handleAnalyzeStart = (input) => {
    const options = parseOptions(input);
    if (!options) return;
    setParsedOptions(options);

    if (detectDecisionType(input)) {
      setFlowState('questionnaire');
    } else {
      executeAnalysis(options, null);
    }
  };

  const handleQuestionnaireComplete = (answers) => {
    executeAnalysis(parsedOptions, answers);
  };

  const handleReset = () => {
    setResult(null);
    setParsedOptions(null);
    setActionPlan(null);
    setIsFallback(false);
    setUserAnswers(null);
    setArmor(null);
    setFlowState('hero');
  };

  return (
    <div className="app-container">
      <div className="bg-layer"></div>
      <div className="glow-orb">
        <div className="glow-orb-inner"></div>
      </div>

      <header className="container-main header flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="logo-box">DK</div>
          <span className="logo-text">DecisionKiller</span>
        </div>
        {flowState !== 'hero' && flowState !== 'loading' && (
          <button onClick={handleReset} className="btn-reset">
            <RefreshCw size={16} /> Start Over
          </button>
        )}
      </header>

      <main className="main-content container-main">
        {flowState === 'hero' && (
          <div className="section-gap">
            <HeroSection onAnalyze={handleAnalyzeStart} />
          </div>
        )}

        {flowState === 'questionnaire' && (
          <div className="section-gap">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-white text-3xl mb-2 tracking-tight">Personalizing Engine</h2>
              <p className="text-muted">Analyzing traits for {parsedOptions?.optionA} vs {parsedOptions?.optionB}</p>
            </div>
            <Questionnaire
              onComplete={handleQuestionnaireComplete}
              onCancel={handleReset}
            />
          </div>
        )}

        {flowState === 'loading' && (
          <div className="section-gap flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '50vh' }}>
            <div className="loading-spinner mb-8"></div>
            <h2 className="text-white text-2xl tracking-tight mb-2">Synthesizing Options</h2>
            <p className="text-muted font-bold">Querying intelligence matrix...</p>
          </div>
        )}

        {flowState === 'results' && result && (
          <div className="animate-fade-in section-gap flex flex-col w-full">
            {isFallback && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-center text-sm font-bold mx-auto mb-8 animate-slide-up">
                AI Service Unavailable. Deterministic Local Engine Enabled.
              </div>
            )}

            <h2 className="text-center text-white" style={{ marginBottom: '8px' }}>
              {parsedOptions?.optionA} <span className="text-muted font-bold">vs</span> {parsedOptions?.optionB}
            </h2>
            <p className="text-center text-muted font-bold" style={{ marginBottom: '64px' }}>
              {isFallback ? 'Deterministic logic applied.' : 'AI Intelligence applied.'} Here is your clarity edge.
            </p>

            <div className="flex flex-col" style={{ gap: '80px', width: '100%' }}>
              <ScoreDisplay result={result} optionA={parsedOptions?.optionA} optionB={parsedOptions?.optionB} />

              <div className="grid grid-cols-2 gap-grid w-full">
                <BiasCheck biases={result.biases} />
                <ActionPlan recommendation={result.recommendation} plan={actionPlan} />
              </div>
            </div>

            <div className="section-gap text-center flex justify-center pb-24" style={{ paddingBottom: '96px', width: '100%' }}>
              <button onClick={handleReset} className="saas-button">
                Analyze another dilemma
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer container-main">
        <p>Client-side logic + Secure API Proxy. No tracking.</p>
      </footer>
    </div>
  );
}

export default App;
