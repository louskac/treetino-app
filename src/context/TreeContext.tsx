"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

export type AssetStatus = 'OPEN' | 'CONSTRUCTED' | 'LIVE';

export interface VerificationData {
    timestamp: number;
    txHash: string;
    blockNumber: number;
    values: {
        solarW: number;
        battery: number;
    };
}

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
    batteryLevel?: number;

    // On-Chain Verification
    verification?: VerificationData;
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
        voltage: 48.2,
        batteryLevel: 87.0,
        verification: {
            timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
            txHash: '0x473100c77eef7fb91ee90142a758da918987c1ede919d7626028d94c54978a4f',
            blockNumber: 33384632,
            values: {
                solarW: 34.0,
                battery: 87.1
            }
        }
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

    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({
        address: address,
    });

    useEffect(() => {
        if (isConnected && balanceData) {
            // Use real wallet balance (formatted from wei)
            const formattedBalance = formatUnits(balanceData.value, balanceData.decimals);
            setBalance(parseFloat(formattedBalance));
        }
    }, [isConnected, balanceData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://treetino-victronenergy.up.railway.app/api/status');
                const data = await res.json();

                // { solarW: number, soc: number, netPowerW: number, isBulbOn: boolean, timestamp: string }

                setAssets(prevAssets => prevAssets.map(asset => {
                    // Only map real data to Asset ID 1 (Prague) for now
                    if (asset.id === 1 && asset.status === 'LIVE') {
                        // Sync Verification Data
                        let verification = asset.verification;
                        const now = Date.now();
                        const timeSinceLastVerify = now - (verification?.timestamp || 0);

                        // Mock new imprint if > 15 mins
                        if (timeSinceLastVerify > 15 * 60 * 1000) {
                            verification = {
                                timestamp: now,
                                txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                                blockNumber: (verification?.blockNumber || 33384632) + 1,
                                values: {
                                    solarW: data.solarW,
                                    battery: data.soc
                                }
                            };
                        }

                        return {
                            ...asset,
                            currentWattage: data.solarW,
                            batteryLevel: data.soc,
                            voltage: 48.0,
                            totalProductionKwh: asset.totalProductionKwh + (data.solarW / 3600),
                            verification
                        };
                    }

                    // Keep other assets simulated or zeroed
                    return asset;
                }));

                // Update Balance logic (simplified)
                // If NOT connected to wallet, use simulation. If connected, balance comes from chain.
                if (!isConnected) {
                    const cycleYield = (data.solarW * 0.005); // Mock yield calculation based on real W
                    const evCost = evMode ? 0.05 : 0;
                    setBalance(prev => +(prev + cycleYield - evCost).toFixed(4));
                }

            } catch (err) {
                console.error("Failed to fetch live status:", err);

                // Fallback: If live data fails, restore state from last immutable on-chain imprint
                setAssets(prevAssets => prevAssets.map(asset => {
                    if (asset.id === 1 && asset.status === 'LIVE' && asset.verification) {
                        return {
                            ...asset,
                            currentWattage: asset.verification.values.solarW,
                            batteryLevel: asset.verification.values.battery,
                            voltage: 48.0,
                            // Mark as relying on verification data implicitly
                        };
                    }
                    return asset;
                }));
            }
        };

        const timer = setInterval(fetchData, 2000);
        fetchData(); // Initial call

        return () => clearInterval(timer);
    }, [evMode, isConnected]);

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