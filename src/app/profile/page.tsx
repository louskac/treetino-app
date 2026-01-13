"use client";

import React, { useContext } from 'react';
import { TreeContext } from '@/src/context/TreeContext';

export default function ProfilePage() {
    const { userBalance } = useContext(TreeContext);

    return (
        <div className="flex flex-col items-center pt-10 pb-20">
            <div className="w-full max-w-2xl px-4">
                <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

                {/* Profile Card */}
                <div className="glass-heavy rounded-3xl p-8 border border-white/5 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-[3px] shadow-[0_0_25px_rgba(0,224,255,0.4)]">
                        <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden">
                            <img
                                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jakub"
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white">Jakub</h2>
                        <p className="text-primary font-mono text-sm mb-4">Treetino Pilot • Early Adopter</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/10">Verified Investor</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/10">Level 5</span>
                        </div>
                    </div>
                </div>

                {/* Wallet Section */}
                <div className="glass rounded-3xl p-8 border border-white/5 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Wallet Balance</h3>
                        <button className="text-xs text-primary font-bold hover:text-white transition-colors">HISTORY</button>
                    </div>

                    <div className="text-4xl font-bold text-white font-mono mb-2">
                        ${userBalance.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mb-6">Available for investment or withdrawal</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-3 rounded-xl bg-primary text-black font-bold hover:bg-white transition-colors">
                            Deposit
                        </button>
                        <button className="py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors">
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Settings List */}
                <div className="glass rounded-3xl overflow-hidden border border-white/5">
                    {[
                        { icon: 'settings', label: 'Account Settings' },
                        { icon: 'security', label: 'Security & 2FA' },
                        { icon: 'notifications', label: 'Notifications' },
                        { icon: 'help', label: 'Help & Support' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-600 text-sm">chevron_right</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="text-red-500 text-sm font-bold hover:text-red-400 transition-colors">Sign Out</button>
                </div>
            </div>
        </div>
    );
}
