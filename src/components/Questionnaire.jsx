import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Questionnaire({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({
        skillLevel: '',
        dsaStrength: 5,
        mathComfort: 5,
        financialPressure: '',
        workStyle: ''
    });

    const updateAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
        else onComplete(answers);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else onCancel();
    };

    const isNextDisabled = () => {
        switch (step) {
            case 1: return !answers.skillLevel;
            case 4: return !answers.financialPressure;
            case 5: return !answers.workStyle;
            default: return false; // sliders always have a value
        }
    };

    const renderRadioOptions = (key, options) => (
        <div className="flex flex-col gap-4 w-full">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => updateAnswer(key, opt)}
                    className={`px-6 py-4 rounded-xl border text-left font-bold transition-all ${answers[key] === opt
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-white/10 bg-[#0a0a0a] text-slate-400 hover:border-white/30 hover:text-white'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );

    return (
        <div className="glass-card max-w-2xl mx-auto flex flex-col items-center animate-slide-up" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>

            {/* Header / Progress */}
            <div className="w-full flex justify-between items-center mb-8">
                <button onClick={prevStep} className="text-muted hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                    <ArrowLeft size={16} /> Back
                </button>
                <span className="text-white font-extrabold text-sm tracking-widest uppercase">Step {step} of 5</span>
                <div style={{ width: '70px' }}></div> {/* Spacer for centering */}
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>

            {/* Content */}
            <div className="flex-grow w-full flex flex-col justify-center animate-fade-in" key={step}>
                {step === 1 && (
                    <>
                        <h3 className="text-white text-center mb-8 text-2xl">Current Skill Level?</h3>
                        {renderRadioOptions('skillLevel', ['Beginner', 'Intermediate', 'Advanced'])}
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 className="text-white text-center mb-4 text-2xl">Rate your DSA strength</h3>
                        <p className="text-muted text-center mb-12 font-medium">Data Structures & Algorithms (0 - 10)</p>
                        <input
                            type="range"
                            min="0" max="10"
                            value={answers.dsaStrength}
                            onChange={(e) => updateAnswer('dsaStrength', parseInt(e.target.value))}
                        />
                        <div className="text-center mt-8 text-white font-extrabold text-4xl">{answers.dsaStrength}</div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3 className="text-white text-center mb-4 text-2xl">Rate your Math comfort</h3>
                        <p className="text-muted text-center mb-12 font-medium">Calculus, Linear Algebra, Stats (0 - 10)</p>
                        <input
                            type="range"
                            min="0" max="10"
                            value={answers.mathComfort}
                            onChange={(e) => updateAnswer('mathComfort', parseInt(e.target.value))}
                        />
                        <div className="text-center mt-8 text-white font-extrabold text-4xl">{answers.mathComfort}</div>
                    </>
                )}

                {step === 4 && (
                    <>
                        <h3 className="text-white text-center mb-8 text-2xl">Financial Pressure?</h3>
                        {renderRadioOptions('financialPressure', ['Low', 'Medium', 'High'])}
                    </>
                )}

                {step === 5 && (
                    <>
                        <h3 className="text-white text-center mb-8 text-2xl">Preferred Work Style?</h3>
                        {renderRadioOptions('workStyle', ['Research', 'Product Development', 'Infrastructure', 'Security'])}
                    </>
                )}
            </div>

            {/* Footer / Next */}
            <div className="w-full mt-12 flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={isNextDisabled()}
                    className={`saas-button flex items-center gap-2 ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {step === 5 ? 'Analyze Results' : 'Next Step'} <ArrowRight size={18} />
                </button>
            </div>

        </div>
    );
}
