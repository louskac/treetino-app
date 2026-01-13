"use client";

import React, { useContext, useState } from 'react';
import { TreeContext } from '@/src/context/TreeContext';

const MOCK_ITEMS = [
    { id: 1, name: 'Treetino Unit [Prague]', yield: '15% APY', price: 950, type: 'Solar Tree', color: 'from-yellow-400 to-orange-500' },
    { id: 2, name: 'Treetino Unit [Berlin]', yield: '12% APY', price: 850, type: 'Hybrid Tree', color: 'from-green-400 to-emerald-600' },
    { id: 3, name: 'Treetino Unit [Dubai]', yield: '18% APY', price: 1200, type: 'Solar Tree', color: 'from-yellow-400 to-orange-500' },
    { id: 4, name: 'Treetino Unit [Oslo]', yield: '11% APY', price: 900, type: 'Wind Tree', color: 'from-cyan-400 to-blue-600' },
    { id: 5, name: 'Treetino Unit [Miami]', yield: '14% APY', price: 1100, type: 'Solar Tree', color: 'from-yellow-400 to-orange-500' },
    { id: 6, name: 'RWA Asset #104', yield: '13% APY', price: 500, type: 'Fractional', color: 'from-purple-400 to-pink-600' },
];

const FILTERS = ['All', 'Solar Tree', 'Wind Tree', 'Hybrid Tree'];

export default function MarketplacePage() {
    const { userBalance } = useContext(TreeContext);
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredItems = activeFilter === 'All'
        ? MOCK_ITEMS
        : MOCK_ITEMS.filter(item => item.type === activeFilter);

    const handleBuy = (item: typeof MOCK_ITEMS[0]) => {
        console.log(`Buying ${item.name} for $${item.price}`);
    };

    return (
        <div className="pb-10">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">RWA Marketplace</h1>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-gray-400 text-sm">Live Energy Assets Available</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar py-2">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap text-sm font-semibold tracking-wide
                            ${activeFilter === filter
                                ? 'bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(0,224,255,0.3)]'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredItems.map(item => (
                    <div key={item.id} className="group glass-panel rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,224,255,0.15)]">

                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-[1px] shadow-lg`}>
                                <div className="w-full h-full rounded-2xl bg-surface-dark/90 flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-white">
                                        {item.type === 'Solar Tree' ? 'solar_power' : item.type === 'Wind Tree' ? 'wind_power' : 'energy_savings_leaf'}
                                    </span>
                                </div>
                            </div>
                            <span className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 border-white/10">
                                {item.type}
                            </span>
                        </div>

                        {/* Title & Info */}
                        <div className="mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-gray-400 text-xs">Tokenized Real World Asset</p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-6 relative z-10 bg-black/20 rounded-xl p-3 border border-white/5">
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Yield</p>
                                <p className="text-secondary font-bold text-lg drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">{item.yield}</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10"></div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Price</p>
                                <p className="text-white font-bold text-lg">${item.price}</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => handleBuy(item)}
                            className="relative z-10 w-full py-3.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl font-bold text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                        >
                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                            Invest Now
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>

                        {/* Decorative Background Gradients */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity duration-500`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

