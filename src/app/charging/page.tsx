"use client";

import React, { useContext } from 'react';
import { TreeContext } from '@/src/context/TreeContext';

export default function ChargingPage() {
    const { isEVCharging, toggleEV, currentWattage, userBalance } = useContext(TreeContext);

    return (
        <div className="min-h-screen p-8 text-white bg-background-dark font-display flex flex-col items-center justify-center">

            <div className="w-full max-w-lg">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-pulse-glow p-4 rounded-full bg-surface-highlight/30">
                        ev_station
                    </span>
                    <h1 className="text-4xl font-bold mb-2">EV Charging Simulation</h1>
                    <p className="text-gray-400">Boost your yield by simulating EV charging demand.</p>
                </div>

                {/* Main Card */}
                <div className={`
                    relative rounded-3xl p-8 border-2 transition-all duration-500 overflow-hidden
                    ${isEVCharging
                        ? 'bg-surface-dark border-primary shadow-[0_0_30px_rgba(13,242,13,0.2)]'
                        : 'bg-surface-dark border-surface-highlight shadow-none'}
                `}>

                    {/* Active Status Chip */}
                    <div className={`
                        absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity duration-300
                        ${isEVCharging ? 'opacity-100 bg-primary text-black' : 'opacity-0'}
                    `}>
                        Yield Boost: Active
                    </div>

                    <div className="mb-8">
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Simulation Status</p>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            {isEVCharging ? 'High Demand Mode' : 'Standard Yield'}
                            {isEVCharging && <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>}
                        </h2>
                    </div>

                    {/* Yield Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className={`
                            p-4 rounded-xl border transition-all duration-300
                            ${isEVCharging ? 'bg-primary/10 border-primary' : 'bg-background-dark border-surface-highlight'}
                        `}>
                            <p className="text-xs text-gray-400 mb-1">Income Multiplier</p>
                            <div className="flex items-end gap-2">
                                <span className={`text-xl font-bold ${isEVCharging ? 'text-primary' : 'text-white'}`}>
                                    {isEVCharging ? '3x Bonus' : '1x Base'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-background-dark border border-surface-highlight">
                            <p className="text-xs text-gray-400 mb-1">Simulated Draw</p>
                            <span className="text-xl font-bold text-white">
                                {isEVCharging ? `+${(currentWattage * 0.8).toFixed(1)} kW` : '0 kW'}
                            </span>
                        </div>
                    </div>

                    {/* Toggle Action */}
                    <button
                        onClick={toggleEV}
                        className={`
                            w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 cursor-pointer
                            ${isEVCharging
                                ? 'bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white'
                                : 'bg-primary text-black hover:bg-white border border-primary'}
                        `}
                    >
                        {isEVCharging ? 'Deactivate Boost Mode' : 'Activate EV Simulation'}
                    </button>

                    {/* Background Animation for Charging */}
                    {isEVCharging && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse"></div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Total Earnings (Base + Boost):
                        <span className="text-white ml-2 font-mono font-bold">${userBalance.toFixed(2)}</span>
                    </p>
                </div>

            </div>
        </div>
    );
}
