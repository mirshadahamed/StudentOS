'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BrainCircuit, Sparkles, TrendingUp, 
  ShieldAlert, Loader2, ArrowRight, Target, Activity, MapPin, Building, ShieldCheck
} from 'lucide-react';
import { withFinanceUserBody } from '../apiClient';

export default function AIAdvisorPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceOptions, setAdviceOptions] = useState(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('Initializing AI Core...');

  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Analyzing Colombo Stock Exchange (CSE)...",
      "Scanning local Fixed Deposit rates...",
      "Evaluating Unit Trusts (CAL, NDB Wealth)...",
      "Building 3-Tier LKR Strategy..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  const getAdvice = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setLoading(true);
    setError('');
    setAdviceOptions(null);

    try {
      const res = await fetch('/api/finance/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withFinanceUserBody({ amount: parseFloat(amount) }))
      });

      if (!res.ok) throw new Error("Failed to connect to AI Core");
      
      const data = await res.json();
      setAdviceOptions(data.options); // Access the 'options' array from the backend
    } catch (err) {
      setError("The AI is currently unavailable. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (category) => {
    if (category.toLowerCase().includes('low')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (category.toLowerCase().includes('medium')) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getRiskIcon = (category) => {
    if (category.toLowerCase().includes('low')) return <ShieldCheck size={16} />;
    if (category.toLowerCase().includes('medium')) return <TrendingUp size={16} />;
    return <ShieldAlert size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans p-8 selection:bg-cyan-500/30 overflow-hidden">
      
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto mt-4">
        
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors mb-6 font-bold text-sm tracking-wider uppercase">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                <MapPin size={14} /> Sri Lanka Region Active
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 flex items-center gap-4"
              >
                AI Wealth Strategist <BrainCircuit className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" size={42} />
              </motion.h1>
              <p className="text-neutral-400 mt-4 text-lg max-w-2xl leading-relaxed">
                Hyper-localized financial intelligence. Enter your surplus funds, and our AI will build a 3-tier strategy using local Unit Trusts, FDs, and the CSE.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT: THE INPUT FORM */}
          <div className="lg:col-span-2 sticky top-8">
            <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/20" />
              
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2 relative z-10">
                <Sparkles className="text-cyan-400" size={24} /> Analyze Surplus
              </h2>
              <p className="text-sm text-neutral-400 mb-8 relative z-10">
                How much extra <strong className="text-white">LKR</strong> do you have this month? Let the AI calculate 3 diverse paths for your money.
              </p>
              
              <form onSubmit={getAdvice} className="space-y-6 relative z-10">
                <div>
                  <div className="relative group/input">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-lg transition-colors group-focus-within/input:text-cyan-400">LKR</span>
                    <input 
                      type="number" 
                      required min="1" step="1" 
                      placeholder="e.g. 100000" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-20 pr-6 py-5 text-2xl text-white font-black focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !amount} 
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl mt-4 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={22} /> Processing Markets...</>
                  ) : (
                    <><Activity size={22} /> Generate 3 Strategies</>
                  )}
                </button>
              </form>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-start gap-3 relative z-10">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0" /> {error}
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-4 px-2 opacity-60">
              <Building size={16} className="text-cyan-400" />
              <div className="text-xs font-bold text-neutral-400 flex gap-3">
                <span>• CSE Stocks</span>
                <span>• Unit Trusts</span>
                <span>• Bank FDs</span>
              </div>
            </div>
          </div>

          {/* RIGHT: THE 3-TIER OUTPUT */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {!adviceOptions && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-neutral-900/20 border border-white/5 border-dashed rounded-[2rem]"
                >
                  <div className="w-24 h-24 bg-neutral-900 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <BrainCircuit size={40} className="text-neutral-700" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-300 mb-2">Awaiting Financial Data</h3>
                  <p className="text-neutral-500 font-medium max-w-sm">Enter your surplus amount to deploy the AI and generate your 3-tier Sri Lankan portfolio.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-cyan-900/10 border border-cyan-500/20 rounded-[2rem] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] animate-[scan_2s_ease-in-out_infinite]" style={{ backgroundSize: '100% 200%' }} />
                  <div className="relative z-10 w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
                  <p className="relative z-10 text-cyan-400 font-black tracking-widest uppercase transition-all duration-300">
                    {loadingText}
                  </p>
                </motion.div>
              )}

              {adviceOptions && !loading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col gap-6"
                >
                  {adviceOptions.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }}
                      className="bg-neutral-900/60 backdrop-blur-3xl border border-white/10 hover:border-cyan-500/30 p-8 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] transition-all group-hover:bg-cyan-500/10" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-black uppercase tracking-widest rounded-xl ${getRiskColor(item.category)}`}>
                          {getRiskIcon(item.category)} {item.category}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Expected Return</p>
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-end gap-1">
                            {item.estimatedReturn} <ArrowRight size={18} className="text-blue-500" />
                          </p>
                        </div>
                      </div>
                      
                      <h2 className="relative z-10 text-2xl font-black text-white mb-3">
                        {item.title}
                      </h2>
                      
                      <p className="relative z-10 text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                        {item.explanation}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
