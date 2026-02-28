import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

export default function ScoreDisplay({ result, optionA, optionB }) {
    const { totalA, totalB, clarityScore, recommendation, riskLevel, radarData, insights } = result;

    const getRiskColorClass = (level) => {
        switch (level) {
            case 'High': return 'text-red';
            case 'Medium': return 'text-yellow';
            case 'Low': return 'text-green';
            default: return 'text-muted';
        }
    };

    return (
        <div className="grid grid-cols-2 gap-grid">
            {/* Left Column: Big Numbers */}
            <div className="glass-card flex flex-col justify-between" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="glow-orb-inner" style={{ top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.15)' }}></div>

                <div style={{ marginBottom: '40px' }}>
                    <div className="score-clarity-label flex justify-between items-center w-full">
                        <span>Clarity Edge</span>
                        {insights && insights.length > 0 && (
                            <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Personalized</span>
                        )}
                    </div>
                    <div className="score-big-number">{clarityScore}%</div>
                    <div className="score-recommendation">Leaning Toward {recommendation}</div>
                </div>

                {insights && insights.length > 0 && (
                    <div style={{ marginBottom: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                        <h4 className="text-white font-extrabold mb-4" style={{ fontSize: '15px' }}>Why This Recommendation?</h4>
                        <ul className="flex flex-col gap-3">
                            {insights.map((insight, idx) => (
                                <li key={idx} className="text-muted text-sm flex gap-3 leading-relaxed">
                                    <span className="text-blue mt-1">•</span>
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '32px', marginBottom: '32px', gap: '32px' }}>
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                            <span className="text-muted font-bold" style={{ fontSize: '14px' }}>{optionA}</span>
                            <span className="text-white font-extrabold" style={{ fontSize: '18px' }}>{totalA}</span>
                        </div>
                        <div className="bar-container">
                            <div className="bar-fill bar-blue" style={{ width: `${totalA}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                            <span className="text-muted font-bold" style={{ fontSize: '14px' }}>{optionB}</span>
                            <span className="text-white font-extrabold" style={{ fontSize: '18px' }}>{totalB}</span>
                        </div>
                        <div className="bar-container">
                            <div className="bar-fill bar-purple" style={{ width: `${totalB}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                    <span className="text-muted font-bold">Predicted Risk Level:</span>
                    <span className={`font-extrabold ${getRiskColorClass(riskLevel)}`}>{riskLevel}</span>
                </div>
            </div>

            {/* Right Column: Radar Chart */}
            <div className="glass-card flex flex-col items-center justify-center" style={{ minHeight: '450px' }}>
                <div className="score-clarity-label text-center" style={{ width: '100%', marginBottom: '32px' }}>Dimensional Analysis</div>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" width={400} height={350} data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} stroke="transparent" />
                    <Radar name={optionA} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Radar name={optionB} dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                    />
                </RadarChart>
            </div>
        </div>
    );
}
