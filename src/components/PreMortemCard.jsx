import React, { useState } from 'react';

const RISKS = [
    "Distraction / Lack of Focus",
    "Financial Stress",
    "Skill Gap",
    "Burnout",
    "Lack of Mentorship",
    "Overconfidence",
    "Inconsistent Execution",
    "Fear of Failure"
];

export default function PreMortemCard({ recommendation, onGenerate }) {
    const [selected, setSelected] = useState([]);

    const toggleRisk = (risk) => {
        setSelected(prev =>
            prev.includes(risk) ? prev.filter(r => r !== risk) : [...prev, risk]
        );
    };

    return (
        <div className="glass-card w-full animate-slide-up" style={{ marginTop: '0px', position: 'relative', overflow: 'hidden' }}>
            <div className="glow-orb-inner" style={{ top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(239, 68, 68, 0.1)' }}></div>

            <div className="text-center mb-8">
                <h3 className="text-white text-3xl font-extrabold mb-2" style={{ color: '#ef4444' }}>Execution Armor</h3>
                <p className="text-muted font-medium">Imagine you completely failed at {recommendation} in 90 days. What caused it?</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {RISKS.map(risk => (
                    <button
                        key={risk}
                        onClick={() => toggleRisk(risk)}
                        className={`px-4 py-3 rounded-lg border text-left font-bold transition-all text-sm ${selected.includes(risk)
                                ? 'border-red-500 bg-red-500/10 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                : 'border-white/10 bg-[#0a0a0a] text-slate-400 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {risk}
                    </button>
                ))}
            </div>

            <div className="flex justify-center mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                    onClick={() => onGenerate(selected)}
                    disabled={selected.length === 0}
                    className={`saas-button flex items-center gap-2 ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 4px 20px rgba(239,68,68,0.3)' }}
                >
                    Generate Failure Prevention Plan
                </button>
            </div>
        </div>
    );
}
