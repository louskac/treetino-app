"use client";

import React, { useContext } from 'react';
import { TreeContext } from '@/src/context/TreeContext';

export default function MonitorPage() {
    const { currentWattage, userBalance, gridStatus, voltage, current, totalKwh } = useContext(TreeContext);

    // Calculate gauge rotation or fill based on wattage (assuming max 10kW for visualization)
    const maxKw = 10;
    const percentage = Math.min((currentWattage / maxKw) * 100, 100);

    return (
        <div className="pb-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 w-full max-w-4xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] pl-4 md:pl-0">System Monitor</h1>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Central Gauge Section */}
                <div className="lg:col-span-2 glass-heavy rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${currentWattage > 0 ? 'bg-secondary animate-pulse box-glow' : 'bg-gray-600'}`}></div>
                            <span className="text-sm text-gray-400 uppercase tracking-widest font-mono">Active Production</span>
                        </div>
                        <span className="glass px-3 py-1 rounded text-secondary text-xs border-white/10 font-mono flex items-center gap-2">
                            <span className="material-symbols-outlined text-[14px]">grid_4x4</span>
                            {gridStatus}
                        </span>
                    </div>

                    {/* Gauge Container */}
                    <div className="relative w-80 h-40 mt-10 mb-6 z-10">
                        {/* Background Arc */}
                        <div className="w-full h-full border-[20px] border-white/5 rounded-t-full border-b-0 absolute top-0 left-0"></div>

                        {/* Dynamic Arc */}
                        <svg className="w-full h-full absolute top-0 left-0 overflow-visible" viewBox="0 0 200 100">
                            <defs>
                                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#39FF14" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#00E0FF" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="url(#gaugeGradient)"
                                strokeWidth="20"
                                strokeLinecap="round"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                                className="transition-all duration-1000 ease-out"
                                style={{
                                    filter: 'drop-shadow(0 0 15px rgba(57, 255, 20, 0.4))'
                                }}
                            />
                        </svg>

                        {/* Needle / Value */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center transform translate-y-1/2">
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-bold text-white tracking-tighter drop-shadow-lg">{currentWattage.toFixed(2)}</span>
                                <span className="text-sm text-primary font-bold uppercase tracking-widest mt-2">kW Output</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-sm border-t border-white/10 pt-6 z-10">
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase mb-1 tracking-wider">Voltage</p>
                            <p className="text-xl font-mono text-white">{voltage.toFixed(1)}V</p>
                        </div>
                        <div className="text-center border-l border-r border-white/10 px-4">
                            <p className="text-[10px] text-gray-500 uppercase mb-1 tracking-wider">Current</p>
                            <p className="text-xl font-mono text-white">{current.toFixed(1)}A</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase mb-1 tracking-wider">Total Yield</p>
                            <p className="text-xl font-mono text-white">{totalKwh.toFixed(0)}kWh</p>
                        </div>
                    </div>

                    {/* Background Grid Effect */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>
                </div>

                {/* Side Stats */}
                <div className="flex flex-col gap-6">
                    {/* Revenue Card */}
                    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                            <p className="text-gray-400 text-xs uppercase mb-1 tracking-wider">Unclaimed Revenue</p>
                            <h2 className="text-4xl font-bold text-white mb-4 text-glow">${userBalance.toFixed(2)}</h2>

                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-300">Auto-Selling to Grid</span>
                            </div>
                        </div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                    </div>

                    {/* Battery Storage Placeholder */}
                    <div className="glass-panel rounded-3xl p-6 relative flex flex-col justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-500">battery_charging_full</span>
                            <span className="text-[10px] border border-gray-600 rounded px-2 py-0.5 text-gray-400 uppercase tracking-widest">In Development</span>
                        </div>
                        <p className="text-gray-400 text-xs uppercase mb-1 tracking-wider">Battery Storage</p>
                        <h2 className="text-3xl font-bold text-gray-500 font-mono">-- kWh</h2>
                    </div>
                </div>

                {/* Live Logs */}
                <div className="lg:col-span-3 glass-heavy rounded-3xl p-6 border border-white/5 min-h-[200px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-white/90">
                            <span className="material-symbols-outlined text-primary">terminal</span>
                            Inverter Telemetry
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                            <span className="w-2 h-2 rounded-full bg-yellow-500/50"></span>
                            <span className="w-2 h-2 rounded-full bg-green-500 box-glow"></span>
                        </div>
                    </div>
                    <div className="font-mono text-sm space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-primary/70">[10:42:01] MPPT Tracker 1 locked.</span>
                            <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">OPTIMAL</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-400">[10:42:05] Grid feed-in synchronization.</span>
                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">OK</span>
                        </div>
                        <div className="flex justify-between items-center opacity-50">
                            <span className="text-gray-500">[10:42:15] Checking thermal parameters...</span>
                            <span className="text-gray-500 text-[10px]">PENDING</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

