'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, PiggyBank, Plus, Target, 
  Trophy, X, Calendar, Sparkles
} from 'lucide-react';

export default function SavingsPage() {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Goal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', target: '', current: '', color: '#a855f7', deadline: '' 
  });

  // Add Funds Modal State (NEW)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedJar, setSelectedJar] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  // 1. Fetch Data
  const fetchSavings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/savings');
      const data = await res.json();
      setSavings(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchSavings(); }, []);

  // 2. Add New Savings Goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('http://localhost:5000/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          target: parseFloat(formData.target),
          current: parseFloat(formData.current || 0),
          color: formData.color,
          deadline: formData.deadline
        }),
      });
      await fetchSavings();
      setIsModalOpen(false);
      setFormData({ name: '', target: '', current: '', color: '#a855f7', deadline: '' });
    } finally { setIsSubmitting(false); }
  };

  // 3. Deposit Funds into Existing Goal (NEW)
  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!selectedJar || !addAmount) return;
    setIsSubmitting(true);
    
    try {
      await fetch(`http://localhost:5000/api/savings/${selectedJar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountToAdd: parseFloat(addAmount) })
      });
      await fetchSavings();
      setIsAddFundsOpen(false);
      setAddAmount('');
      setSelectedJar(null);
    } catch (error) {
      console.error("Error adding funds", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations
  const totalSaved = savings.reduce((sum, item) => sum + item.current, 0);
  const totalTarget = savings.reduce((sum, item) => sum + item.target, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans p-8">
      
      {/* Background Purple Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 font-bold">
            <ArrowLeft size={20} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                Wishlist Jars <Sparkles className="text-pink-400" size={32} />
              </motion.h1>
              <p className="text-gray-400 mt-2 text-lg">Set goals, stash your cash, and treat yourself.</p>
            </div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex gap-4">
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-right min-w-[150px]">
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">Total Saved</p>
                <p className="text-2xl font-bold text-white">${totalSaved.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-right min-w-[150px]">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Goals</p>
                <p className="text-2xl font-bold text-white">${totalTarget.toFixed(2)}</p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* --- ACTION BAR --- */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PiggyBank className="text-purple-400" /> Active Goals
          </h2>
          <button onClick={() => setIsModalOpen(true)} className="group bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Goal
          </button>
        </div>

        {/* --- SAVINGS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" /></div>
          ) : savings.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-gray-400 text-xl font-bold mb-2">No goals set yet! 🎯</p>
            </div>
          ) : (
            savings.map((item, index) => {
              const progress = Math.min((item.current / item.target) * 100, 100);
              const isComplete = progress >= 100;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                  className="bg-neutral-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full pointer-events-none" style={{ backgroundColor: item.color }} />

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: item.color }}>
                        {isComplete ? <Trophy size={24} /> : <Target size={24} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        {item.deadline && (
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar size={12} /> By {new Date(item.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-3xl font-bold text-white">${item.current.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">Saved of ${item.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: item.color }}>{progress.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full" style={{ backgroundColor: item.color }}
                    />
                  </div>

                  {/* 💰 ADD FUNDS BUTTON */}
                  {isComplete ? (
                    <div className="mt-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                      <Trophy size={18} /> Goal Reached!
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setSelectedJar(item); setIsAddFundsOpen(true); }}
                      className="mt-5 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={18} /> Deposit Funds
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* --- ADD NEW GOAL MODAL (Original) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><Target className="text-purple-500" /> New Goal</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">What are you saving for?</label>
                  <input type="text" required placeholder="e.g. PS5, Vacation" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Target Amount ($)</label>
                    <input type="number" required min="1" step="0.01" placeholder="1000" value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Already Saved ($)</label>
                    <input type="number" min="0" step="0.01" placeholder="0" value={formData.current} onChange={(e) => setFormData({...formData, current: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Jar Color</label>
                    <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full h-[50px] bg-black/50 border border-white/10 rounded-xl p-1 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Deadline (Optional)</label>
                    <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full h-[50px] bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500 transition-colors custom-calendar-icon" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                  {isSubmitting ? 'Saving...' : 'Create Jar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD FUNDS MODAL (NEW) --- */}
      <AnimatePresence>
        {isAddFundsOpen && selectedJar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddFundsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <button onClick={() => setIsAddFundsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-1 text-white">Deposit Funds</h2>
              <p className="text-gray-400 text-sm mb-6">Adding money to <span style={{color: selectedJar.color}} className="font-bold">{selectedJar.name}</span></p>

              <form onSubmit={handleAddFunds} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Amount to Add ($)</label>
                  <input type="number" required min="1" step="0.01" placeholder="e.g. 20" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-xl font-bold" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full text-white font-bold py-4 rounded-xl mt-2 transition-colors flex items-center justify-center gap-2" style={{ backgroundColor: selectedJar.color }}>
                  {isSubmitting ? 'Adding...' : `Add to Jar`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}