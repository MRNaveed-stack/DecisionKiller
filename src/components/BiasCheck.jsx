import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function BiasCheck({ biases }) {
    if (!biases || biases.length === 0) return null;

    return (
        <div className="flex flex-col gap-6" style={{ height: '100%' }}>
            <h3 className="text-white">Cognitive Check</h3>

            <div className="glass-card flex flex-col" style={{ borderColor: 'rgba(234,179,8,0.2)', backgroundColor: '#161616', height: '100%', padding: '32px' }}>
                <div className="flex items-center gap-4" style={{ marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AlertCircle color="#eab308" size={20} />
                    </div>
                    <p className="text-muted font-bold" style={{ lineHeight: '1.5' }}>
                        Your hesitation might be driven by these psychological traps:
                    </p>
                </div>

                <div className="flex flex-col gap-4" style={{ marginTop: 'auto' }}>
                    {biases.map((bias, idx) => (
                        <div key={idx} className="glass-card-inner flex gap-4">
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308', marginTop: '8px', flexShrink: 0, boxShadow: '0 0 8px rgba(234,179,8,0.5)' }}></div>
                            <div>
                                <h4 className="text-white font-extrabold" style={{ fontSize: '18px', marginBottom: '4px' }}>{bias}</h4>
                                <p className="text-muted" style={{ fontSize: '14px' }}>Recognize when this pattern is dictating your inaction.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
