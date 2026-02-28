import React from 'react';

export default function ActionPlan({ recommendation, plan }) {
    if (!plan || plan.length === 0) return null;

    return (
        <div className="flex flex-col gap-6" style={{ height: '100%' }}>
            <h3 className="text-white">Execution Protocol</h3>

            <div className="glass-card" style={{ height: '100%', padding: '32px' }}>
                <p className="text-muted font-bold" style={{ marginBottom: '32px' }}>
                    A structured roadmap to commit to <span className="text-white font-extrabold">{recommendation}</span>.
                </p>

                <div style={{ position: 'relative' }}>
                    {plan.map((step, idx) => (
                        <div key={idx} className="timeline-item">
                            {idx < plan.length - 1 && <div className="timeline-line"></div>}
                            <div className="timeline-node">{step.day}</div>
                            <div className="timeline-content">
                                <div className="timeline-title">{step.title}</div>
                                <div className="timeline-desc">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
