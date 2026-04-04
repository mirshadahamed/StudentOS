'use client';
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/app/productivity/page.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, TrendingUp, Timer, Brain,
  Plus, ArrowUpRight, AlertCircle, Sparkles, Wallet,
  Send, Loader2, Check
} from 'lucide-react';
import { tasksAPI, aiAPI, userAPI } from '@/lib/api';

// ─── AMBIENT BACKGROUND ───────────────────────────────────────────────────────
const AmbientBg = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ background:'#050505' }}>
    {/* Very subtle pinkish-orange orbs */}
    <motion.div
      animate={{ scale:[1,1.18,1], x:['-6%','6%','-6%'], opacity:[0.12,0.2,0.12] }}
      transition={{ duration:16, repeat:Infinity, ease:'easeInOut' }}
      className="absolute rounded-full"
      style={{ top:'-15%', left:'-10%', width:'65vw', height:'65vw', background:'radial-gradient(circle, #f97316 0%, #ec4899 45%, transparent 75%)', filter:'blur(100px)' }}
    />
    <motion.div
      animate={{ scale:[1.15,1,1.15], x:['8%','-6%','8%'], opacity:[0.1,0.18,0.1] }}
      transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
      className="absolute rounded-full"
      style={{ bottom:'-15%', right:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle, #ec4899 0%, #f97316 40%, transparent 72%)', filter:'blur(110px)' }}
    />
    {/* Falling sparkle particles */}
    {[...Array(10)].map((_,i) => (
      <motion.div key={i}
        initial={{ y:'-5vh', x:`${8+i*9}vw`, opacity:0 }}
        animate={{ y:'105vh', opacity:[0, 0.35, 0.35, 0] }}
        transition={{ duration:10+i*1.5, delay:i*1.1, repeat:Infinity, ease:'linear' }}
        className="absolute text-sm select-none"
        style={{ color: i%2===0 ? 'rgba(249,115,22,0.5)' : 'rgba(236,72,153,0.4)', fontSize:`${12+i*2}px` }}
      >✦</motion.div>
    ))}
  </div>
);

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────
const BootScreen = ({ onComplete }) => (
  <motion.div initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.9 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]">
    <motion.div initial={{ scale:0.82, opacity:0 }} animate={{ scale:1, opacity:1 }}
      transition={{ duration:0.85, ease:'easeOut' }} className="text-center">
      <h1 className="text-5xl font-black tracking-[0.45em] mb-4">
        <span style={{ background:'linear-gradient(135deg,#f97316,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          STUDENT
        </span>
        <span className="text-white font-light">OS</span>
      </h1>
      <div className="w-52 h-[2px] mx-auto rounded-full overflow-hidden bg-white/5">
        <motion.div initial={{ x:'-100%' }} animate={{ x:'100%' }}
          transition={{ duration:1.8, ease:'easeInOut', onComplete }}
          className="w-full h-full rounded-full"
          style={{ background:'linear-gradient(90deg, transparent, #f97316, #ec4899, transparent)' }}
        />
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.35em] font-bold animate-pulse text-orange-500/60">
        Initializing Planning Hub...
      </p>
    </motion.div>
  </motion.div>
);

// ─── NAV CARD ─────────────────────────────────────────────────────────────────
const NavCard = ({ icon:Icon, label, sub, href, delay }) => (
  <Link href={href} className="w-full">
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.45 }}
      className="group p-6 rounded-[2rem] h-44 flex flex-col justify-between transition-all cursor-pointer hover:-translate-y-1"
      style={{
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(249,115,22,0.15)',
        backdropFilter:'blur(12px)',
      }}
      whileHover={{ boxShadow:'0 0 30px rgba(249,115,22,0.12)' }}
    >
      <div className="flex justify-between items-start">
        <div className="p-2.5 rounded-2xl" style={{ background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.15)' }}>
          <Icon size={17} style={{ color:'#f97316' }} />
        </div>
        <ArrowUpRight size={14} className="opacity-20 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color:'#f97316' }} />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1.5 text-neutral-600">{label}</p>
        <p className="text-xl font-black tracking-tight text-white">{sub}</p>
      </div>
    </motion.div>
  </Link>
);

// ─── ADD TASK FORM ────────────────────────────────────────────────────────────
const AddTaskForm = ({ onAdded }) => {
  const [open,        setOpen]        = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [state,       setState]       = useState('idle'); // idle | success | error
  const [form,        setForm]        = useState({ title:'', course:'', deadline:'', category:'Assignment', priority:'Medium' });
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setState('error'); setTimeout(()=>setState('idle'),2200); return; }
    setSaving(true);
    const result = await tasksAPI.create({ ...form, title:form.title.trim() });
    setSaving(false);
    if (result?._id) {
      setForm({ title:'', course:'', deadline:'', category:'Assignment', priority:'Medium' });
      setOpen(false);
      setState('success');
      setTimeout(()=>setState('idle'), 2500);
      onAdded(result);
    } else {
      setState('error');
      setTimeout(()=>setState('idle'), 2500);
    }
  };

  const fieldCls = "rounded-xl px-3 py-2.5 text-sm outline-none font-medium transition-all w-full";
  const fieldStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(249,115,22,0.18)', color:'white' };

  return (
    <form onSubmit={submit}
      className="rounded-[2rem] p-7 relative z-20"
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.18)', backdropFilter:'blur(12px)' }}>

      {/* Header row */}
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={()=>setOpen(o=>!o)}
          className="p-2.5 rounded-full transition-all flex items-center justify-center"
          style={{
            background: open ? 'linear-gradient(135deg,#f97316,#ec4899)' : 'rgba(249,115,22,0.1)',
            color: open ? 'white' : '#f97316',
            transform: open ? 'rotate(45deg)' : 'none',
            border: '1px solid rgba(249,115,22,0.2)',
          }}>
          <Plus size={17} />
        </button>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Quick Add Task</p>
        <AnimatePresence>
          {state === 'success' && (
            <motion.span initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              className="flex items-center gap-1.5 text-xs font-bold ml-auto text-emerald-400">
              <Check size={13}/> Task saved!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Title + submit */}
      <div className="grid grid-cols-12 gap-3 items-center mb-3">
        <input type="text" placeholder="Task title..."
          className="col-span-8 rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all"
          style={{
            background:'rgba(255,255,255,0.05)',
            border: `1.5px solid ${state==='error' ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.18)'}`,
            color:'white',
          }}
          value={form.title} onChange={e=>s('title',e.target.value)}
        />
        <motion.button type="submit" disabled={saving}
          animate={state==='error' ? { x:[-5,5,-5,5,0] } : {}}
          className="col-span-4 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          style={{ background: state==='error' ? '#ef4444' : 'linear-gradient(135deg,#f97316,#ec4899)' }}>
          {saving   ? <><Loader2 size={14} className="animate-spin"/>Saving...</>
           : state==='error' ? 'Add title first'
           : <><Send size={13}/>Add Task</>}
        </motion.button>
      </div>

      {/* Expanded fields */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.23,1,0.32,1] }}
            className="overflow-hidden">
            <div className="grid grid-cols-4 gap-3 pt-4"
              style={{ borderTop:'1px solid rgba(249,115,22,0.1)' }}>
              {[
                { label:'Course',   key:'course',   type:'text',  placeholder:'e.g. CS3012' },
                { label:'Deadline', key:'deadline', type:'date',  placeholder:'' },
              ].map(f=>(
                <div key={f.key}>
                  <p className="text-[9px] font-black uppercase mb-1.5 ml-1 text-neutral-600">{f.label}</p>
                  <input type={f.type} placeholder={f.placeholder} className={fieldCls} style={fieldStyle}
                    value={form[f.key]} onChange={e=>s(f.key,e.target.value)}/>
                </div>
              ))}
              <div>
                <p className="text-[9px] font-black uppercase mb-1.5 ml-1 text-neutral-600">Category</p>
                <select className={fieldCls} style={fieldStyle} value={form.category} onChange={e=>s('category',e.target.value)}>
                  {['Assignment','Exam','Project','Lab Report','Presentation'].map(c=><option key={c} style={{ background:'#111' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase mb-1.5 ml-1 text-neutral-600">Priority</p>
                <select className={fieldCls} style={fieldStyle} value={form.priority} onChange={e=>s('priority',e.target.value)}>
                  {['High','Medium','Low'].map(p=><option key={p} style={{ background:'#111' }}>{p}</option>)}
                </select>
              </div>
            </div>
            <p className="text-[10px] mt-2.5 text-neutral-700">
              Leave Priority as Medium — AI auto-assigns based on deadline + category. Score = deadline urgency (0–70) + priority bonus.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProductivityHub() {
  const [isBooting,   setIsBooting]   = useState(true);
  const [stats,       setStats]       = useState({ total:0, weekTasks:0, completed:0, prodScore:0, critical:0, avgAiScore:0 });
  const [aiInsight,   setAiInsight]   = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [userName,    setUserName]    = useState('Student');

  const refresh = async () => {
    const storedEmail = typeof window !== 'undefined' ? window.localStorage.getItem('studentos-user-email') : '';
    const [a, s, t, profile] = await Promise.all([
      tasksAPI.getAnalytics(),
      aiAPI.getSuggestions(),
      tasksAPI.getAll(),
      userAPI.getProfile(storedEmail || ''),
    ]);
    setStats(a || { total:0, weekTasks:0, completed:0, prodScore:0, critical:0, avgAiScore:0 });
    if (s?.length) setAiInsight(s[0]);
    setRecentTasks((t ?? []).slice(0, 4));
    setUserName(profile?.name || 'Student');
  };

  useEffect(() => { if (!isBooting) refresh(); }, [isBooting]);

  const handleAdded = (task) => {
    setRecentTasks(prev => [task, ...prev].slice(0,4));
    refresh();
  };

  const cards = [
    { icon:CheckCircle2, label:'Registry',     sub:'All Tasks',  href:'/productivity/tasks'      },
    { icon:TrendingUp,   label:'Tracker',      sub:'Progress',   href:'/productivity/progress'   },
    { icon:Brain,        label:'Intelligence', sub:'AI Planner', href:'/productivity/ai-planner' },
    { icon:Timer,        label:'Flow State',   sub:'Focus Mode', href:'/productivity/focus'      },
    { icon:Wallet,       label:'Finance',      sub:'Money Hub',  href:'/finance'                 },
  ];

  const statRow = [
    { label:'Total Tasks',  val: stats.total },
    { label:'Completed',    val: stats.completed },
    { label:'Productivity', val: `${stats.prodScore}%` },
    { label:'Critical',     val: stats.critical },
  ];

  const scoreColor = (s) => s>=70?'#f43f5e':s>=40?'#fb923c':'#34d399';

  return (
    <div className="min-h-screen relative text-white" style={{ fontFamily:'system-ui,sans-serif' }}>
      <AnimatePresence>{isBooting && <BootScreen onComplete={()=>setIsBooting(false)}/>}</AnimatePresence>
      <AmbientBg/>

      <main className="relative z-10 max-w-5xl mx-auto px-8 py-16 space-y-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 text-orange-500/70">Smart Planning Hub</p>
          <h1 className="text-5xl font-black tracking-tighter text-white">Welcome, {userName}.</h1>
          <p className="text-sm mt-1.5 text-neutral-500">Your academic command centre</p>
        </motion.div>

        {/* Add task form */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <AddTaskForm onAdded={handleAdded}/>
        </motion.div>

        {/* Recent tasks preview */}
        <AnimatePresence>
          {recentTasks.length > 0 && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="rounded-2xl px-5 py-4"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Recent tasks</p>
                <Link href="/productivity/tasks" className="text-[10px] font-black text-orange-500/70 hover:text-orange-400 transition-colors">View all →</Link>
              </div>
              <div className="space-y-2">
                {recentTasks.map((t,i)=>{
                  const sc = t.aiScore ?? 0;
                  const col = scoreColor(sc);
                  return (
                    <div key={t._id||i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:col }}/>
                      <p className="text-sm font-medium flex-1 truncate text-neutral-200">{t.title}</p>
                      <span className="text-[10px] font-black shrink-0" style={{ color:col }}>{sc}/100</span>
                      {t.daysLeft != null && (
                        <span className="text-[10px] text-neutral-700 shrink-0">{t.daysLeft < 0 ? 'Overdue' : `${t.daysLeft}d`}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((c,i)=><NavCard key={i} {...c} delay={0.28+i*0.08}/>)}
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center py-10 gap-y-6"
          style={{ borderTop:'1px solid rgba(249,115,22,0.1)', borderBottom:'1px solid rgba(249,115,22,0.1)' }}>
          {statRow.map((s,i)=>(
            <div key={i} className="flex flex-col items-center px-10 md:px-14"
              style={{ borderRight: i<3 ? '1px solid rgba(249,115,22,0.1)' : 'none' }}>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2.5 font-black text-center text-neutral-700">{s.label}</p>
              <p className="text-4xl font-extralight tracking-tighter text-white">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Alert + AI insight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-[2rem] p-7 flex items-center gap-5"
            style={{ background:'rgba(251,146,60,0.06)', border:'1px solid rgba(251,146,60,0.15)' }}>
            <AlertCircle size={24} className="shrink-0 text-orange-500/40"/>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-orange-500/70">System Alert</p>
              <p className="text-sm font-medium leading-relaxed text-neutral-400">
                {stats.critical > 0
                  ? `${stats.critical} task${stats.critical>1?'s':''} due within 7 days. Open Progress to review.`
                  : stats.total === 0
                  ? 'No tasks yet. Add your first task above to get started.'
                  : 'No critical deadlines right now. Keep the momentum.'}
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] p-7 flex items-center gap-5"
            style={{ background:'rgba(236,72,153,0.06)', border:'1px solid rgba(236,72,153,0.15)' }}>
            <Sparkles size={24} className="shrink-0 text-pink-500/40"/>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-pink-500/70">AI Insight</p>
              <p className="text-sm font-medium leading-relaxed text-neutral-400">
                {aiInsight?.text ?? (stats.total === 0 ? 'Add tasks to activate AI scoring and insights.' : 'Loading AI insights...')}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
