'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Wallet, PiggyBank, Receipt, BrainCircuit, 
  ChevronRight, ShieldCheck, Activity, ChevronDown, 
  TrendingUp, BarChart2, Sprout, AlertTriangle, Droplets
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

import MoneyRain from '../../components/MoneyRain';
import WealthCity from '../../components/WealthCity';

// --- 💎 INNOVATIVE CATEGORY CARD (TOP GRID) ---
const ModuleCard = ({ title, description, icon: Icon, link, color, delay }) => (
  <Link href={link} className="block w-full h-full relative group z-10">
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="h-full relative overflow-hidden bg-neutral-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:bg-neutral-800/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_10px_30px_-10px_rgba(0,0,0,0.5)]"
    >
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${color}`} />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="inline-flex p-4 rounded-2xl mb-6 border border-white/5 bg-neutral-950/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
            {Icon}
          </div>
          <h2 className="text-2xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">{title}</h2>
          <p className="text-neutral-400 font-medium leading-relaxed">{description}</p>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <span className="text-sm font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">Access Module</span>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

// --- 🧊 INTERACTIVE 3D PARALLAX STAT CARD ---
const Interactive3DCard = ({ title, amount, subtitle, colorClass, icon: Icon }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative group h-full cursor-pointer hover:border-white/20 transition-colors"
      >
        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none ${colorClass}`} />
        
        <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-4">
            <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">{title}</p>
            <div style={{ transform: "translateZ(50px)" }} className={`p-2 rounded-xl bg-white/5 border border-white/10 shadow-xl ${colorClass.replace('bg-', 'text-')}`}>
              <Icon size={20} />
            </div>
          </div>

          <p style={{ transform: "translateZ(40px)" }} className="text-4xl font-black text-white mb-2 drop-shadow-2xl">{amount}</p>
          <p style={{ transform: "translateZ(20px)" }} className={`text-xs font-medium ${colorClass.replace('bg-', 'text-')}`}>{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
};

// --- 🪴 GAMIFIED WEALTH TERRARIUM COMPONENT ---
const WealthTerrarium = ({ income, expenses }) => {
  const net = income - expenses;
  const healthRatio = income > 0 ? (net / income) * 100 : 0;
  
  let state = 'neutral';
  let config = { 
    color: 'text-neutral-500', glow: 'shadow-neutral-500/20', bg: 'bg-neutral-900', message: "Awaiting Financial Data", icon: <Droplets size={48} className="text-neutral-600" />
  };

  if (income > 0 || expenses > 0) {
    if (net < 0) {
      state = 'critical'; config = { color: 'text-rose-500', glow: 'shadow-rose-500/50', bg: 'bg-rose-950/30', border: 'border-rose-500/30', message: "Critical: Bleeding Cash! Reduce spending.", icon: <AlertTriangle size={48} className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" /> };
    } else if (healthRatio < 20) {
      state = 'stable'; config = { color: 'text-amber-400', glow: 'shadow-amber-500/30', bg: 'bg-amber-950/20', border: 'border-amber-500/30', message: "Stable: Barely breaking even. Save more!", icon: <Sprout size={48} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" /> };
    } else {
      state = 'thriving'; config = { color: 'text-emerald-400', glow: 'shadow-emerald-500/50', bg: 'bg-emerald-950/20', border: 'border-emerald-500/30', message: "Thriving: Excellent wealth generation!", icon: <Sprout size={64} className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.9)]" /> };
    }
  }

  const particles = Array.from({ length: 8 }).map((_, i) => (
    <motion.div key={i} initial={{ y: 0, opacity: 0, scale: 0 }} animate={{ y: -100, opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, delay: Math.random() * 2 }} className="absolute w-2 h-2 rounded-full bg-emerald-400 blur-[1px]" style={{ left: `${Math.random() * 60 + 20}%`, bottom: '20%' }} />
  ));

  return (
    <div className={`relative overflow-hidden backdrop-blur-xl border ${config.border || 'border-white/10'} p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center transition-all duration-700 ${config.bg}`}>
      <div className={`absolute inset-0 opacity-20 transition-all duration-700 ${state === 'critical' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-600 via-transparent to-transparent animate-pulse' : ''}`} />
      <h3 className="text-xl font-bold mb-2 text-white relative z-10">Financial Health</h3>
      <p className={`text-xs font-bold uppercase tracking-widest mb-8 relative z-10 ${config.color}`}>{config.message}</p>
      
      <div className={`relative w-48 h-48 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center mb-6 transition-all duration-1000 ${config.glow}`} style={{ boxShadow: `inset 0 0 30px rgba(255,255,255,0.05), 0 0 40px var(--tw-shadow-color)` }}>
        <AnimatePresence mode="wait">
          <motion.div key={state} initial={{ scale: 0, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: state === 'stable' ? [0, -5, 5, 0] : 0 }} transition={{ duration: 0.8, type: "spring", rotate: { repeat: state === 'stable' ? Infinity : 0, duration: 4, ease: "easeInOut" } }} className="relative z-10">
            {config.icon}
          </motion.div>
        </AnimatePresence>
        {state === 'thriving' && particles}
        {state === 'critical' && <motion.div initial={{ y: -20, opacity: 1 }} animate={{ y: 80, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute text-rose-500 blur-[1px] font-bold">-LKR</motion.div>}
      </div>
      <div className="w-32 h-2 rounded-full bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)] mt-2 relative z-10" />
    </div>
  );
};

// --- 🚀 MAIN DASHBOARD ---
export default function FinanceHub() {
  const [stats, setStats] = useState({ income: 0, expenses: 0, savings: 0, savingsGoal: 0, splits: 0 });
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  const BAR_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6']; 

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [txRes, saveRes, splitRes] = await Promise.all([
          fetch('http://localhost:5000/api/transactions'),
          fetch('http://localhost:5000/api/savings'),
          fetch('http://localhost:5000/api/splits')
        ]);

        const txData = await txRes.json();
        const saveData = await saveRes.json();
        const splitData = await splitRes.json();

        let totalInc = 0; let totalExp = 0; const categories = {};

        txData.forEach(t => {
          if (t.type && t.type.toLowerCase() === 'income') {
            totalInc += (t.amount || 0);
          } else {
            totalExp += (t.amount || 0);
            const cat = t.category || 'Misc';
            categories[cat] = (categories[cat] || 0) + t.amount;
          }
        });

        const totalSav = saveData.reduce((sum, s) => sum + (s.current || 0), 0);
        // Calculate the total goal amount across all savings pots
        const totalTarget = saveData.reduce((sum, s) => sum + (s.target || 0), 0);
        
        const totalSplit = splitData.reduce((sum, s) => sum + (s.total_amount || 0), 0);

        setStats({ 
          income: totalInc, 
          expenses: totalExp, 
          savings: totalSav, 
          savingsGoal: totalTarget > 0 ? totalTarget : 500000, // Fallback if no goals exist
          splits: splitData.length 
        });
        
        setBarData(Object.keys(categories).map(key => ({ name: key, value: categories[key] })).sort((a, b) => b.value - a.value));
        setPieData([{ name: 'Total Income', value: totalInc }, { name: 'Total Saved', value: totalSav }, { name: 'Total Spent', value: totalExp }, { name: 'Split Bills', value: totalSplit }].filter(item => item.value > 0));

      } catch (error) { console.error("Data error:", error); } finally { setLoading(false); }
    };
    fetchAllData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-cyan-500">
      <div className="relative w-24 h-24 mb-6"><div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div><div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div></div>
      <p className="font-bold tracking-[0.2em] uppercase text-sm animate-pulse text-cyan-400">Initializing System...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <MoneyRain />

      <div className="min-h-screen flex flex-col justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 mt-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-widest mb-8">
              <ShieldCheck size={14} /> StudentOS Secure Systems
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Welcome to the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]">Finance Hub.</span>
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            <ModuleCard title="Income" description="Log your salary, freelance gigs, and incoming cash flow." icon={<TrendingUp size={28} className="text-blue-400" />} link="/finance/income" color="bg-blue-500" delay={0.3} />
            <ModuleCard title="Expenses" description="Track daily transactions and categorize your spending." icon={<Wallet size={28} className="text-rose-400" />} link="/finance/expenses" color="bg-rose-500" delay={0.4} />
            <ModuleCard title="Savings" description="Create goals, track progress, and fund what you want." icon={<PiggyBank size={28} className="text-emerald-400" />} link="/finance/savings" color="bg-emerald-500" delay={0.5} />
            <ModuleCard title="Split Bills" description="Divide costs effortlessly. Automatic math and notifications." icon={<Receipt size={28} className="text-purple-400" />} link="/finance/split" color="bg-purple-500" delay={0.6} />
            <ModuleCard title="Reports" description="Generate deep-dive PDFs and export your financial history." icon={<BarChart2 size={28} className="text-amber-400" />} link="/finance/reports" color="bg-amber-500" delay={0.7} />
            <ModuleCard title="AI Advisor" description="Get custom, data-driven financial strategies from Gemini AI." icon={<BrainCircuit size={28} className="text-cyan-400" />} link="/finance/advisor" color="bg-cyan-500" delay={0.8} />
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="flex flex-col items-center justify-center text-neutral-500 animate-bounce">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Scroll to Analyze</p>
            <ChevronDown size={24} />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-6 md:p-12 pb-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#050505]">
        <h2 className="text-3xl md:text-4xl font-black mb-12 flex items-center gap-4">
          <Activity className="text-cyan-400" size={32} /> Wealth Analytics
        </h2>

        {/* --- THE 3D INTERACTIVE STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Interactive3DCard title="Total Income" amount={`LKR ${stats.income.toLocaleString()}`} subtitle="All recorded earnings" colorClass="bg-blue-500" icon={TrendingUp} />
          <Interactive3DCard title="Total Saved" amount={`LKR ${stats.savings.toLocaleString()}`} subtitle="Across all savings goals" colorClass="bg-emerald-500" icon={PiggyBank} />
          <Interactive3DCard title="Total Spent" amount={`LKR ${stats.expenses.toLocaleString()}`} subtitle="Recorded outgoings" colorClass="bg-rose-500" icon={Wallet} />
          <Interactive3DCard title="Active Splits" amount={stats.splits} subtitle="Pending split bills" colorClass="bg-purple-500" icon={Receipt} />
        </div>

        {/* --- NEW 3D WEALTH CITY VISUALIZER --- */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-300">Digital Empire Visualizer</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">LIVE 3D RENDER</span>
          </div>
          {/* Passing the dynamic savings and calculated target directly to your 3D component */}
          <WealthCity currentSavings={stats.savings} goalAmount={stats.savingsGoal} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <WealthTerrarium income={stats.income} expenses={stats.expenses} />

          <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
            <h3 className="text-xl font-bold mb-8 text-neutral-300">Spending</h3>
            <div className="h-[250px] w-full">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `LKR ${val}`} />
                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-full w-full flex items-center justify-center text-neutral-600 font-medium text-sm">No expenses recorded yet.</div>}
            </div>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
            <h3 className="text-xl font-bold mb-8 text-neutral-300">Distribution</h3>
            <div className="h-[250px] w-full relative flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="h-full w-full flex items-center justify-center text-neutral-600 font-medium text-sm">Add data to view distribution.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}