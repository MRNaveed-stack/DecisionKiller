import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ onAnalyze }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const lowerInput = input.toLowerCase();
        if (!lowerInput.includes(' vs ') && !lowerInput.includes(' vs. ') && !lowerInput.includes(' or ')) {
            setError('Format required: Option A vs Option B');
            return;
        }
        setError('');
        onAnalyze(input);
    };

    return (
        <div className="hero-wrapper animate-slide-up">
            <h1 style={{ marginBottom: '24px' }}>
                Stop Overthinking.<br />
                <span className="gradient-text">Decide.</span>
            </h1>
            <p className="hero-subtitle">Structured clarity in under 5 minutes.</p>

            <form onSubmit={handleSubmit} className="form-wrapper animate-slide-up delay-100">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Example: Remote Work vs Office Work"
                    className="saas-input"
                    autoFocus
                />
                <button type="submit" className="saas-button">
                    Analyze <ArrowRight size={20} />
                </button>
            </form>

            <div style={{ height: '32px', marginTop: '16px' }}>
                {error && <p className="text-red font-bold animate-fade-in">{error}</p>}
            </div>
        </div>
    );
}
