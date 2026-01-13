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
        const fetchData = async () => {
            try {
                const res = await fetch('https://treetino-victronenergy.up.railway.app/api/status');
                const data = await res.json();

                // { solarW: number, soc: number, netPowerW: number, isBulbOn: boolean, timestamp: string }

                setAssets(prevAssets => prevAssets.map(asset => {
                    // Only map real data to Asset ID 1 (Prague) for now
                    if (asset.id === 1 && asset.status === 'LIVE') {
                        return {
                            ...asset,
                            currentWattage: data.solarW, // Map solarW directly
                            // We don't have a direct 'battery' field yet, maybe reuse voltage for now or just ignore soc?
                            // Let's assume voltage is still simulated or constant 48V for now as API doesn't give voltage.
                            voltage: 48.0,
                            totalProductionKwh: asset.totalProductionKwh + (data.solarW / 3600), // Accumulate
                        };
                    }

                    // Keep other assets simulated or zeroed
                    return asset;
                }));

                // Update Balance logic (simplified)
                const cycleYield = (data.solarW * 0.005); // Mock yield calculation based on real W
                const evCost = evMode ? 0.05 : 0;
                setBalance(prev => +(prev + cycleYield - evCost).toFixed(4));

            } catch (err) {
                console.error("Failed to fetch live status:", err);
            }
        };

        const timer = setInterval(fetchData, 2000);
        fetchData(); // Initial call

        return () => clearInterval(timer);
    }, [evMode]);

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