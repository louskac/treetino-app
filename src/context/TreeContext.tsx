"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export const TreeContext = createContext({
    currentWattage: 4.2,
    voltage: 48.0,
    current: 87.5,
    totalKwh: 12400,
    userBalance: 24500,
    isEVCharging: false,
    toggleEV: () => { },
    gridStatus: 'Connected',
});

export const TreeProvider = ({ children }: { children: React.ReactNode }) => {
    const [wattage, setWattage] = useState(4.2);
    const [voltage, setVoltage] = useState(48.0);
    const [current, setCurrent] = useState(87.5);
    const [balance, setBalance] = useState(24500);
    const [evMode, setEvMode] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            // Simulate slight fluctuations
            const newVoltage = 48.0 + (Math.random() - 0.5) * 0.5;
            const newWattage = +(wattage + (Math.random() - 0.5) * 0.1).toFixed(2);

            // P = V * I -> I = P / V (Converting kW to W for calc then back to A? Or just arbitrary consistent math)
            // Let's just simulate amperage roughly consistent: 4.2kW = 4200W. 4200 / 48 ~ 87.5A
            const calculatedCurrent = (newWattage * 1000) / newVoltage;

            setVoltage(+newVoltage.toFixed(1));
            setWattage(newWattage);
            setCurrent(+calculatedCurrent.toFixed(1));

            setBalance(prev => +(prev + (evMode ? 0.05 : 0.01)).toFixed(2));
        }, 2000);
        return () => clearInterval(timer);
    }, [evMode, wattage]);

    return (
        <TreeContext.Provider value={{
            currentWattage: wattage,
            voltage: voltage,
            current: current,
            totalKwh: 12400.5,
            userBalance: balance,
            isEVCharging: evMode,
            toggleEV: () => setEvMode(!evMode),
            gridStatus: 'Connected - Selling 100%'
        }}>
            {children}
        </TreeContext.Provider>
    );
};