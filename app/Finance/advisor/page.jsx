'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BrainCircuit, Sparkles, TrendingUp, 
  ShieldAlert, DollarSign, Loader2, ArrowRight
} from 'lucide-react';


export default function AIAdvisorPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');

  const getAdvice = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setLoading(true);
    setError('');
    setAdvice(null);

    try {
      const res = await fetch('http://localhost:5000/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (!res.ok) throw new Error("Failed to connect to AI Core");
      
      const data = await res.json();
      setAdvice(data);
    } catch (err) {
      setError("The AI is currently unavailable. Please check your API key and backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative font-sans p-8 selection:bg-cyan-500/30">
      
      {/* Custom AI Blue Glow */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 font-bold text-sm">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3"
              >
                Gemini Wealth AI <BrainCircuit className="text-blue-500" size={36} />
              </motion.h1>
              <p className="text-neutral-400 mt-2 text-lg">Personalized financial strategies powered by Google Generative AI.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT: THE INPUT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Sparkles className="text-cyan-400" size={20} /> Analyze Surplus
              </h2>
              <p className="text-sm text-neutral-400 mb-6">Enter an amount of extra money you have this month, and the AI will tell you exactly what to do with it.</p>
              
              <form onSubmit={getAdvice} className="space-y-4">
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                    <input 
                      type="number" 
                      required min="1" step="0.01" 
                      placeholder="e.g. 500" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/5 rounded-xl pl-8 pr-4 py-4 text-xl text-white font-bold focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !amount} 
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-xl mt-4 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    <><BrainCircuit size={20} /> Generate Strategy</>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-start gap-2">
                  <ShieldAlert size={16} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: THE AI OUTPUT */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!advice && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-neutral-900/20 border border-white/5 border-dashed rounded-3xl"
                >
                  <BrainCircuit size={48} className="text-neutral-700 mb-4" />
                  <p className="text-neutral-500 font-medium max-w-xs">Awaiting input. Enter your surplus amount to generate a custom financial strategy.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-cyan-900/10 border border-cyan-500/20 rounded-3xl"
                >
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6" />
                  <p className="text-cyan-400 font-bold animate-pulse">Analyzing market logic...</p>
                </motion.div>
              )}

              {advice && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-900/60 backdrop-blur-2xl border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                >
                  <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                    AI Recommendation Generated
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                    {advice.recommendation}
                  </h2>
                  
                  <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                    {advice.explanation}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-950/50 border border-white/5 p-5 rounded-2xl">
                      <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><ShieldAlert size={14}/> Risk Level</p>
                      <p className={`text-xl font-black ${
                        advice.riskLevel.toLowerCase().includes('low') ? 'text-emerald-400' : 
                        advice.riskLevel.toLowerCase().includes('high') ? 'text-rose-400' : 'text-orange-400'
                      }`}>
                        {advice.riskLevel}
                      </p>
                    </div>
                    
                    <div className="bg-neutral-950/50 border border-white/5 p-5 rounded-2xl">
                      <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp size={14}/> Est. Return</p>
                      <p className="text-xl font-black text-cyan-400 flex items-center gap-1">
                        {advice.estimatedReturn} <ArrowRight size={16} className="text-neutral-600" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}