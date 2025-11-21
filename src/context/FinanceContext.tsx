import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiCall } from '../utils/api';

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
    isLoading: boolean;
    error: string | null;
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load transactions from API
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setIsLoading(true);
                const data = await apiCall('/finance');
                setTransactions(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load transactions:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadTransactions();
    }, []);

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };

        // Optimistic update
        setTransactions(prev => [newTransaction, ...prev]);

        try {
            await apiCall('/finance', {
                method: 'POST',
                body: JSON.stringify(newTransaction)
            });
        } catch (err: any) {
            console.error('Failed to add transaction:', err);
            setTransactions(prev => prev.filter(t => t.id !== newTransaction.id));
            setError(err.message);
        }
    };

    const deleteTransaction = async (id: string) => {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;

        // Optimistic update
        setTransactions(prev => prev.filter(t => t.id !== id));

        try {
            await apiCall(`/finance/${id}`, {
                method: 'DELETE'
            });
        } catch (err: any) {
            console.error('Failed to delete transaction:', err);
            setTransactions(prev => [...prev, transaction]);
            setError(err.message);
        }
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
            getCategoryTotals,
            isLoading,
            error
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
