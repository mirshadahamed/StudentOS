'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Plus, Wallet, TrendingUp, AlertTriangle, 
  PiggyBank, Users, CreditCard, X, Save, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// --- Mock Data ---
const initialTransactions = [
  { id: 1, title: 'Freelance Gigs', amount: 450, type: 'income', date: '2023-10-01', category: 'Work' },
  { id: 2, title: 'Monthly Allowance', amount: 500, type: 'income', date: '2023-10-01', category: 'Family' },
  { id: 3, title: 'Grocery Run', amount: 85, type: 'expense', date: '2023-10-03', category: 'Food' },
];

const spendingData = [
  { day: '1', spent: 120, predicted: 120 },
  { day: '5', spent: 340, predicted: 300 },
  { day: '10', spent: 550, predicted: 600 },
  { day: '15', spent: 890, predicted: 900 },
  { day: '20', spent: 1100, predicted: 1200 },
  { day: '25', spent: null, predicted: 1450 }, // Prediction
  { day: '30', spent: null, predicted: 1600 }, // Prediction
];

// --- Components ---

const GlassCard = ({ children, className, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl hover:border-indigo-500/30 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const ProgressBar = ({ current, max, colorClass }) => {
  const percentage = Math.min((current / max) * 100, 100);
  return (
    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden mt-2">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${percentage}%` }} 
        transition={{ duration: 1 }}
        className={`h-full ${colorClass}`} 
      />
    </div>
  );
};

export default function FinanceDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState(2450);

  // Modal State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  const handleAddTransaction = () => {
    if (!amount || !description) return;
    const val = parseFloat(amount);
    const newTx = {
      id: Date.now(),
      title: description,
      amount: val,
      type,
      date: new Date().toISOString().split('T')[0],
      category: 'Misc'
    };
    
    setTransactions([newTx, ...transactions]);
    setBalance(prev => type === 'income' ? prev + val : prev - val);
    setIsModalOpen(false);
    setAmount(''); setDescription('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance <span className="text-indigo-400">OS</span></h1>
          <p className="text-neutral-400 text-sm">Welcome back, Student.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} /> Add Money/Expense
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* 1. MAIN BALANCE & STATS (Top Left - Spans 4) */}
        <GlassCard className="md:col-span-4 flex flex-col justify-between bg-gradient-to-br from-indigo-900/20 to-neutral-900/40">
          <div>
            <p className="text-indigo-200 text-sm font-medium flex items-center gap-2">
              <Wallet size={16} /> Net Balance
            </p>
            <h2 className="text-5xl font-bold mt-2 tracking-tight">${balance.toLocaleString()}</h2>
            <div className="flex gap-4 mt-4">
              <div className="bg-emerald-500/10 px-3 py-1 rounded-lg text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={14} /> +$950 In
              </div>
              <div className="bg-rose-500/10 px-3 py-1 rounded-lg text-rose-400 text-xs font-bold flex items-center gap-1">
                <ArrowDownRight size={14} /> -$320 Out
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
             <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Monthly Budget</span>
                <span className="text-white font-mono">65% Used</span>
             </div>
             <ProgressBar current={65} max={100} colorClass="bg-gradient-to-r from-indigo-500 to-cyan-400" />
          </div>
        </GlassCard>

        {/* 2. END OF MONTH PREDICTION (Top Right - Spans 8) */}
        <GlassCard className="md:col-span-8 relative">
          <div className="flex justify-between items-center mb-4">
             <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
               <TrendingUp size={16} className="text-purple-400" /> AI Forecast
             </h3>
             <span className="bg-purple-500/10 text-purple-300 px-2 py-1 rounded text-xs">
               On Track: Save $200
             </span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSplit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#555" tick={{fontSize: 12}} />
                <YAxis stroke="#555" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px'}} />
                <Area type="monotone" dataKey="spent" stroke="#818cf8" strokeWidth={3} fill="url(#colorSplit)" />
                <Area type="monotone" dataKey="predicted" stroke="#a78bfa" strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 3. SPLIT-IT (Roommate Debt Tracker) - NEW FEATURE */}
        <GlassCard className="md:col-span-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
               <Users size={16} className="text-orange-400" /> Split-It
             </h3>
             <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition">Add Split</button>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">JD</div>
                   <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">Pizza Night</p>
                   </div>
                </div>
                <span className="text-emerald-400 text-sm font-bold">+$12.50</span>
             </div>
             <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">SM</div>
                   <div>
                      <p className="text-sm font-medium">Sarah M.</p>
                      <p className="text-xs text-gray-500">WiFi Bill</p>
                   </div>
                </div>
                <span className="text-rose-400 text-sm font-bold">-$15.00</span>
             </div>
          </div>
        </GlassCard>

        {/* 4. WISHLIST JARS (Visual Saving) - NEW FEATURE */}
        <GlassCard className="md:col-span-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
               <PiggyBank size={16} className="text-pink-400" /> Wishlist Jars
             </h3>
          </div>
          <div className="space-y-4">
            <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>MacBook Pro</span>
                 <span className="text-pink-300">$1,200 / $2,000</span>
               </div>
               <ProgressBar current={1200} max={2000} colorClass="bg-pink-500" />
            </div>
            <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>Sem Break Trip</span>
                 <span className="text-cyan-300">$300 / $500</span>
               </div>
               <ProgressBar current={300} max={500} colorClass="bg-cyan-500" />
            </div>
          </div>
        </GlassCard>

        {/* 5. SUBSCRIPTION STALKER & ALERTS */}
        <GlassCard className="md:col-span-4 bg-red-900/10 border-red-500/20">
          <div className="flex justify-between items-center mb-4">
             <h3 className="flex items-center gap-2 text-sm font-semibold text-red-200 uppercase tracking-wider">
               <AlertTriangle size={16} /> Alerts
             </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <p>Netflix Bill ($15.99) due in <span className="text-white font-bold">2 days</span>.</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
               <div className="w-2 h-2 rounded-full bg-orange-500" />
               <p>Spent 80% of <span className="text-orange-300">Food Budget</span>.</p>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* --- ADD TRANSACTION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-indigo-400" /> Add Transaction
              </h2>

              <div className="space-y-4">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    Expense
                  </button>
                  <button 
                    onClick={() => setType('income')}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-600"
                    placeholder="e.g. Uber Eats, Allowance"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleAddTransaction}
                  className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Transaction
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
