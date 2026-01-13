"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AssetStatus = 'OPEN' | 'CONSTRUCTED' | 'LIVE';

export interface Asset {
    id: number;
    name: string;
    location: string;
    type: 'Solar Tree' | 'Wind Tree' | 'Hybrid Tree';
    yieldApy: string;
    price: number; // Price per unit/share
    color: string;
    status: AssetStatus;

    // Fundraising State
    raisedAmount: number;
    targetAmount: number;

    // Construction State (0-100)
    constructionProgress: number;

    // Live State
    dailyRevenue: number;
    totalProductionKwh: number;
    nominalPower: number; // Max kW output per unit

    // Real-time Telemetry (Simulated)
    currentWattage: number;
    voltage: number;
}

export interface UserInvestment {
    assetId: number;
    shareCount: number; // For this demo, let's treat this as "Units Owned"
    investedAt: Date;
}

interface TreeContextType {
    // Global aggregates
    totalPortfolioValue: number;
    totalDailyRevenue: number;
    userBalance: number;

    // EV Charging global state (could be per-asset later, keeping global for simplicity/demo)
    isEVCharging: boolean;
    toggleEV: () => void;

    // Assets
    assets: Asset[];
    userInvestments: UserInvestment[];
    investInAsset: (assetId: number, amount: number) => void;
    getAssetById: (id: number) => Asset | undefined;
}

// Helper to init assets
const INITIAL_ASSETS: Asset[] = [
    {
        id: 1,
        name: 'Treetino Unit [Prague]',
        location: 'Prague, CZ',
        yieldApy: '15% APY',
        price: 950,
        type: 'Solar Tree',
        color: 'from-yellow-400 to-orange-500',
        status: 'LIVE',
        raisedAmount: 50000,
        targetAmount: 50000,
        constructionProgress: 100,
        dailyRevenue: 12.5,
        totalProductionKwh: 4500,
        nominalPower: 5.5, // kW
        currentWattage: 4200,
        voltage: 48.2
    },
    {
        id: 2,
        name: 'Treetino Unit [Berlin]',
        location: 'Berlin, DE',
        yieldApy: '12% APY',
        price: 850,
        type: 'Hybrid Tree',
        color: 'from-green-400 to-emerald-600',
        status: 'OPEN',
        raisedAmount: 15000,
        targetAmount: 85000,
        constructionProgress: 0,
        dailyRevenue: 0,
        totalProductionKwh: 0,
        nominalPower: 4.2,
        currentWattage: 0,
        voltage: 0
    },
    {
        id: 3,
        name: 'Treetino Unit [Dubai]',
        location: 'Dubai, UAE',
        yieldApy: '18% APY',
        price: 1200,
        type: 'Solar Tree',
        color: 'from-yellow-400 to-orange-500',
        status: 'CONSTRUCTED',
        raisedAmount: 120000,
        targetAmount: 120000,
        constructionProgress: 45,
        dailyRevenue: 0,
        totalProductionKwh: 0,
        nominalPower: 8.0,
        currentWattage: 0,
        voltage: 0
    },
    {
        id: 4,
        name: 'Treetino Unit [Oslo]',
        location: 'Oslo, NO',
        yieldApy: '11% APY',
        price: 900,
        type: 'Wind Tree',
        color: 'from-cyan-400 to-blue-600',
        status: 'OPEN',
        raisedAmount: 45000,
        targetAmount: 90000,
        constructionProgress: 0,
        dailyRevenue: 0,
        totalProductionKwh: 0,
        nominalPower: 6.5,
        currentWattage: 0,
        voltage: 0
    },
    {
        id: 5,
        name: 'Treetino Unit [Miami]',
        location: 'Miami, USA',
        yieldApy: '14% APY',
        price: 1100,
        type: 'Solar Tree',
        color: 'from-yellow-400 to-orange-500',
        status: 'OPEN',
        raisedAmount: 5000,
        targetAmount: 110000,
        constructionProgress: 0,
        dailyRevenue: 0,
        totalProductionKwh: 0,
        nominalPower: 7.2,
        currentWattage: 0,
        voltage: 0
    },
];

export const TreeContext = createContext<TreeContextType>({} as TreeContextType);

// Mock initial investments so the user sees SOMETHING at start (e.g. 1 unit of Prague)
const INITIAL_INVESTMENTS: UserInvestment[] = [
    { assetId: 1, shareCount: 1, investedAt: new Date() }
];

export const TreeProvider = ({ children }: { children: React.ReactNode }) => {
    // State
    const [balance, setBalance] = useState(24500);
    const [evMode, setEvMode] = useState(false);

    const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
    const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(INITIAL_INVESTMENTS);

    useEffect(() => {
        const timer = setInterval(() => {
            // --- Asset Lifecycle & Output Simulation ---
            let cycleYield = 0; // $

            const updatedAssets = assets.map(asset => {
                let updated = { ...asset };

                // 1. Advance Construction
                if (asset.status === 'CONSTRUCTED') {
                    updated.constructionProgress = Math.min(100, asset.constructionProgress + Math.random() * 2);
                    if (updated.constructionProgress >= 100) {
                        updated.status = 'LIVE';
                    }
                }

                // 2. Production Logic (For LIVE assets)
                if (asset.status === 'LIVE') {
                    // Random fluctuation factor (clouds/wind) 0.8 - 1.0
                    const efficiency = 0.8 + (Math.random() * 0.2);
                    const currentOutputKw = asset.nominalPower * efficiency;

                    // Update telemetry
                    updated.currentWattage = +(currentOutputKw * 1000).toFixed(0);
                    updated.voltage = +(48.0 + (Math.random() - 0.5) * 0.5).toFixed(1);

                    updated.totalProductionKwh += (currentOutputKw / 3600); // Very rough integration (kW per second/hour)

                    // Calculate Yield for user if they own it
                    const inv = userInvestments.find(i => i.assetId === asset.id);
                    if (inv) {
                        // Yield: 0.005 $ per kW produced
                        cycleYield += (currentOutputKw * inv.shareCount * 0.005);
                    }
                } else {
                    updated.currentWattage = 0;
                    updated.voltage = 0;
                }

                return updated;
            });

            setAssets(updatedAssets);

            // --- Balance Update ---
            const evCost = evMode ? 0.05 : 0;
            setBalance(prev => +(prev + cycleYield - evCost).toFixed(4));

        }, 2000);
        return () => clearInterval(timer);
    }, [evMode, assets, userInvestments]);

    const investInAsset = (assetId: number, amount: number) => {
        const assetIndex = assets.findIndex(a => a.id === assetId);
        if (assetIndex === -1) return;
        const asset = assets[assetIndex];

        if (asset.status !== 'OPEN') {
            alert("This asset is no longer open for investment.");
            return;
        }

        if (amount > balance) {
            alert("Insufficient funds!");
            return;
        }

        setBalance(prev => prev - amount);

        const newRaised = Math.min(asset.raisedAmount + amount, asset.targetAmount);
        const newStatus = newRaised >= asset.targetAmount ? 'CONSTRUCTED' : 'OPEN';

        const updatedAssets = [...assets];
        updatedAssets[assetIndex] = {
            ...asset,
            raisedAmount: newRaised,
            status: newStatus as AssetStatus
        };
        setAssets(updatedAssets);

        // Shares calculation (Units)
        const units = amount / asset.price;

        setUserInvestments(prev => {
            const existing = prev.find(i => i.assetId === assetId);
            if (existing) {
                return prev.map(i => i.assetId === assetId
                    ? { ...i, shareCount: i.shareCount + units }
                    : i
                );
            } else {
                return [...prev, { assetId, shareCount: units, investedAt: new Date() }];
            }
        });
    };

    const getAssetById = (id: number) => assets.find(a => a.id === id);

    const totalPortfolioValue = userInvestments.reduce((acc, inv) => {
        const asset = assets.find(a => a.id === inv.assetId);
        return acc + (inv.shareCount * (asset?.price || 0));
    }, 0);

    const totalDailyRevenue = assets.reduce((acc, a) => acc + a.dailyRevenue, 0); // Mock for now

    return (
        <TreeContext.Provider value={{
            totalPortfolioValue,
            totalDailyRevenue,
            userBalance: balance,
            isEVCharging: evMode,
            toggleEV: () => setEvMode(!evMode),
            assets,
            userInvestments,
            investInAsset,
            getAssetById
        }}>
            {children}
        </TreeContext.Provider>
    );
};