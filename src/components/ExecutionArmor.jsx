import React from 'react';
import { ShieldAlert, Crosshair, CheckCircle } from 'lucide-react';

export default function ExecutionArmor({ armor }) {
    if (!armor) return null;

    return (
        <div className="glass-card w-full animate-slide-up" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert size={28} color="#ef4444" />
                <h3 className="text-white text-2xl font-extrabold">Failure Prevention Strategies</h3>
            </div>

            <div className="flex flex-col gap-6 mb-10">
                {armor.preventiveStrategies?.map((strat, idx) => (
                    <div key={idx} className="bg-black/40 p-5 rounded-xl border border-red-500/10">
                        <h4 className="text-red font-bold text-sm uppercase tracking-wider mb-2">{strat.risk}</h4>
                        <p className="text-slate-300 font-medium leading-relaxed">{strat.strategy}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Crosshair size={18} className="text-blue" />
                        <h4 className="text-white font-bold uppercase text-sm tracking-wider">Weekly Safeguards</h4>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {armor.weeklySafeguards?.map((sg, idx) => (
                            <li key={idx} className="text-muted text-sm flex gap-3 leading-relaxed">
                                <span className="text-blue mt-1">•</span>
                                {sg}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={18} className="text-green" />
                        <h4 className="text-white font-bold uppercase text-sm tracking-wider">Accountability Mechanism</h4>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                        <p className="text-green font-medium text-sm leading-relaxed">{armor.accountabilityMechanism}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
