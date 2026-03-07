'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wallet, Plus, DollarSign, Calendar, 
  ArrowUpRight, X 
} from 'lucide-react';
import MoneyRain from '../../../components/MoneyRain'; 

export default function IncomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for controlling the Modal UI and Form Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Work' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data from Real Backend
  const fetchIncome = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions');
      const data = await res.json();
      const incomeOnly = data.filter(t => t.type === 'income');
      setTransactions(incomeOnly);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // 2. Add New Income (Now using the UI Form)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setIsSubmitting(true);

    try {
      await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          type: 'income',
          category: formData.category,
          status: 'received'
        }),
      });

      // Refresh list, close modal, and reset form
      await fetchIncome();
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', category: 'Work' });
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans p-8">
      
      <MoneyRain />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6 font-bold">
            <ArrowLeft size={20} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
              >
                Income Streams
              </motion.h1>
              <p className="text-gray-400 mt-2 text-lg">Track your hustle & allowance.</p>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-right min-w-[200px]"
            >
              <p className="text-emerald-500 text-sm font-bold uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-4xl font-bold text-white">+${totalIncome.toFixed(2)}</p>
            </motion.div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Income
          </button>
        </div>

        {/* Transactions List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Syncing with database...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-gray-400 text-xl font-bold mb-2">No money found yet! 💸</p>
              <p className="text-gray-500">Add your first income source to start tracking.</p>
            </div>
          ) : (
            transactions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center justify-between hover:border-emerald-500/50 transition-all cursor-default"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">+${item.amount.toFixed(2)}</p>
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
                    {item.status} <ArrowUpRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD INCOME MODAL UI --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="text-emerald-500" /> New Income
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Income Source</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Freelance Client, Allowance"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Amount ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" required min="1" step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Allowance">Allowance</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Income'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}