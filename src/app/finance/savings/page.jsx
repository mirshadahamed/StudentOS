'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, PiggyBank, Plus, Target, 
  Trophy, X, Calendar, Sparkles, TrendingUp
} from 'lucide-react';
import { withFinanceUserBody, withFinanceUserId } from '../apiClient';

export default function SavingsPage() {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Goal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', target: '', current: '', color: '#a855f7', deadline: '' 
  });

  // Add Funds Modal State
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedJar, setSelectedJar] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  // 1. Fetch Data
  const fetchSavings = async () => {
    try {
      const res = await fetch(withFinanceUserId('/api/finance/savings'));
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
      await fetch('/api/finance/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withFinanceUserBody({
          name: formData.name,
          target: parseFloat(formData.target),
          current: parseFloat(formData.current || 0),
          color: formData.color,
          deadline: formData.deadline
        })),
      });
      await fetchSavings();
      setIsModalOpen(false);
      setFormData({ name: '', target: '', current: '', color: '#a855f7', deadline: '' });
    } finally { setIsSubmitting(false); }
  };

  // 3. Deposit Funds into Existing Goal
  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!selectedJar || !addAmount) return;
    setIsSubmitting(true);
    
    try {
      await fetch(withFinanceUserId(`/api/finance/savings/${selectedJar.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withFinanceUserBody({ amountToAdd: parseFloat(addAmount) }))
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
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans p-8">
      
      {/* Background Purple Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto mt-4">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 font-bold text-sm tracking-wider uppercase">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
                className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 flex items-center gap-4 mb-4"
              >
                Wishlist Jars <Sparkles className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]" size={38} />
              </motion.h1>
              <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">Set your financial goals, stash your LKR securely, and watch your progress grow as you treat yourself.</p>
            </div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex gap-4">
              <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl text-right min-w-[160px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1"><TrendingUp size={14}/> Total Saved</p>
                <p className="text-2xl font-black text-white">LKR {totalSaved.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-right min-w-[160px] backdrop-blur-md shadow-sm">
                <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1"><Target size={14}/> Total Target</p>
                <p className="text-2xl font-black text-white">LKR {totalTarget.toLocaleString()}</p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* --- ACTION BAR --- */}
        <div className="flex justify-between items-center mb-8 bg-neutral-900/40 border border-white/5 backdrop-blur-xl p-4 pl-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold flex items-center gap-3 text-white">
            <PiggyBank className="text-purple-400" size={24} /> Active Goals
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Goal
          </button>
        </div>

        {/* --- SAVINGS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" /></div>
          ) : savings.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-[2rem] border border-white/10 border-dashed backdrop-blur-sm">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Target size={32} className="text-neutral-600" />
              </div>
              <p className="text-neutral-300 text-xl font-bold mb-2">No goals set yet! 🎯</p>
              <p className="text-neutral-500">Create your first wishlist jar to start tracking your savings.</p>
            </div>
          ) : (
            savings.map((item, index) => {
              const progress = Math.min((item.current / item.target) * 100, 100);
              const isComplete = progress >= 100;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                  className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/20 transition-all shadow-xl"
                >
                  {/* Dynamic Color Glow */}
                  <div className="absolute top-[-50px] right-[-50px] w-48 h-48 opacity-20 blur-[50px] rounded-full pointer-events-none transition-opacity group-hover:opacity-40" style={{ backgroundColor: item.color }} />

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]" style={{ backgroundColor: item.color }}>
                        {isComplete ? <Trophy size={26} /> : <Target size={26} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white leading-tight">{item.name}</h3>
                        {item.deadline && (
                          <p className="text-sm text-neutral-400 flex items-center gap-1.5 mt-1 font-medium">
                            <Calendar size={14} /> By {new Date(item.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <p className="text-3xl font-black text-white">LKR {item.current.toLocaleString()}</p>
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Saved of LKR {item.target.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black drop-shadow-md" style={{ color: item.color }}>{progress.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 relative z-10 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ backgroundColor: item.color }}
                    />
                  </div>

                  {/* 💰 ADD FUNDS BUTTON */}
                  <div className="mt-8 relative z-10">
                    {isComplete ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-4 rounded-xl text-center text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                        <Trophy size={18} /> Goal Reached!
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setSelectedJar(item); setIsAddFundsOpen(true); }}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                      >
                        <Plus size={18} /> Deposit LKR
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* --- ADD NEW GOAL MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"><X size={24} /></button>
              
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-white"><Target className="text-purple-500" /> New Wishlist Jar</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">What are you saving for?</label>
                  <input type="text" required placeholder="e.g. PS5, Bali Vacation" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Target Amount</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs transition-colors group-focus-within/input:text-purple-400">LKR</span>
                      <input type="number" required min="1" step="1" placeholder="100000" value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Already Saved</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs transition-colors group-focus-within/input:text-purple-400">LKR</span>
                      <input type="number" min="0" step="1" placeholder="0" value={formData.current} onChange={(e) => setFormData({...formData, current: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Jar Theme</label>
                    <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full h-[54px] bg-black/60 border border-white/10 rounded-xl p-1 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Deadline</label>
                    <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full h-[54px] bg-black/60 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner custom-calendar-icon" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-black tracking-wide py-4 rounded-xl mt-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  {isSubmitting ? 'Creating...' : 'Create Jar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DEPOSIT FUNDS MODAL --- */}
      <AnimatePresence>
        {isAddFundsOpen && selectedJar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddFundsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <button onClick={() => setIsAddFundsOpen(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black mb-1 text-white">Deposit</h2>
              <p className="text-neutral-400 text-sm mb-8">Funding <span style={{color: selectedJar.color}} className="font-black tracking-wide">{selectedJar.name}</span></p>

              <form onSubmit={handleAddFunds} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Amount to Add</label>
                  <div className="relative group/input">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-lg transition-colors" style={{color: selectedJar.color}}>LKR</span>
                    <input 
                      type="number" required min="1" step="1" 
                      placeholder="e.g. 5000" 
                      value={addAmount} 
                      onChange={(e) => setAddAmount(e.target.value)} 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none transition-colors text-2xl font-black shadow-inner" 
                      style={{ focusBorderColor: selectedJar.color }} 
                    />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full text-black font-black tracking-wider py-5 rounded-2xl mt-2 transition-all active:scale-95 flex items-center justify-center gap-2" style={{ backgroundColor: selectedJar.color, boxShadow: `0 0 30px ${selectedJar.color}40` }}>
                  {isSubmitting ? 'Processing...' : `Deposit to Jar`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
