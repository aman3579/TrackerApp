import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Transaction {
    id: string;
    amount: number;
    category: string;
    date: string; // YYYY-MM-DD
    type: 'income' | 'expense';
    description?: string;
    createdAt: number;
}

interface FinanceContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
    deleteTransaction: (id: string) => void;
    getBalance: () => number;
    getIncome: () => number;
    getExpenses: () => number;
    getCategoryTotals: () => Record<string, number>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Load from localStorage
    useEffect(() => {
        const storedTransactions = localStorage.getItem('tracker_transactions');
        if (storedTransactions) {
            try {
                setTransactions(JSON.parse(storedTransactions));
            } catch (e) {
                console.error('Failed to parse transactions', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('tracker_transactions', JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const getIncome = () => {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const getExpenses = () => {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const getBalance = () => {
        return getIncome() - getExpenses();
    };

    const getCategoryTotals = () => {
        const totals: Record<string, number> = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                totals[t.category] = (totals[t.category] || 0) + t.amount;
            });
        return totals;
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            addTransaction,
            deleteTransaction,
            getBalance,
            getIncome,
            getExpenses,
            getCategoryTotals
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
