'use client';
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/app/productivity/focus/page.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Zap, Coffee, Loader2, Clock, Play, Pause } from 'lucide-react';
import { tasksAPI, focusAPI } from '@/lib/api';

const MODES = {
  focus:      { label:'Focus',       mins:25, color:'#38bdf8' },
  shortBreak: { label:'Short Break', mins:5,  color:'#34d399' },
  longBreak:  { label:'Long Break',  mins:15, color:'#a78bfa' },
};

const dl = (d) => d ? Math.ceil((new Date(d) - Date.now()) / 86400000) : null;
const sc = (s) => s>=70?'#f43f5e':s>=40?'#fbbf24':'#34d399';
const hoursLeft  = (prog) => Math.max(0.5, Math.round(((100-prog)/100)*4*10)/10);
const sessNeeded = (prog) => Math.ceil(hoursLeft(prog)/0.5);

// ─── RING TIMER ──────────────────────────────────────────────────────────
const Ring = ({ seconds, total, color }) => {
  const r = 88;
  const circ = 2*Math.PI*r;
  const pct  = seconds/total;
  return (
    <svg width="210" height="210" viewBox="0 0 210 210" className="-rotate-90">
      <circle cx="105" cy="105" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
      <motion.circle cx="105" cy="105" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ-circ*pct} transition={{ duration:0.4 }}/>
    </svg>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function FocusModePage() {
  const [mode,      setMode]      = useState('focus');
  const [seconds,   setSeconds]   = useState(MODES.focus.mins*60);
  const [isActive,  setIsActive]  = useState(false);
  const [tasks,     setTasks]     = useState([]);
  const [selIdx,    setSelIdx]    = useState(0);
  const [sessions,  setSessions]  = useState([]);
  const [pomCount,  setPomCount]  = useState(0);
  const [stats,     setStats]     = useState({ focusHoursToday:'0h 0m', streak:0, completedPomodoros:0 });
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(true);
  const timerRef = useRef(null);
  const m = MODES[mode];

  useEffect(()=>{
    Promise.all([tasksAPI.getAll({ completed:'false' }), focusAPI.getStats()]).then(([t,s])=>{
      const sorted = (t??[]).sort((a,b)=>(b.aiScore||0)-(a.aiScore||0));
      setTasks(sorted);
      setStats(s);
      setPomCount(s.completedPomodoros||0);
      setLoading(false);
    });
  },[]);

  async function handleComplete() {
    clearInterval(timerRef.current);
    setIsActive(false);
    const task = tasks[selIdx];
    setSessions(prev=>[{ type:mode, task:task?.title||'', durationMins:m.mins }, ...prev]);
    if (mode==='focus') setPomCount(p=>p+1);
    setSaving(true);
    await focusAPI.logSession({ taskId:task?._id||null, taskTitle:task?.title||'', type:mode, durationMins:m.mins, userEmail:'' });
    const ns = await focusAPI.getStats();
    setStats(ns);
    setSaving(false);
  }

  useEffect(()=>{
    if (isActive && seconds>0) {
      timerRef.current = setInterval(()=>setSeconds(s=>s-1), 1000);
    } else if (seconds===0 && isActive) {
      handleComplete();
    }
    return ()=>clearInterval(timerRef.current);
  },[isActive, seconds]);

  const switchMode = (nm) => { clearInterval(timerRef.current); setIsActive(false); setMode(nm); setSeconds(MODES[nm].mins*60); };
  const reset = () => { clearInterval(timerRef.current); setIsActive(false); setSeconds(m.mins*60); };

  const mins = String(Math.floor(seconds/60)).padStart(2,'0');
  const secs = String(seconds%60).padStart(2,'0');
  const totalNeeded = tasks.reduce((a,t)=>a+hoursLeft(t.progress), 0);
  const task = tasks[selIdx];

  return (
    <div className="min-h-screen text-white" style={{ background:'#080808', fontFamily:'system-ui,sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-8"
          style={{ background:'radial-gradient(circle,#38bdf8,transparent)', filter:'blur(80px)' }}/>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-7"
          style={{ background:'radial-gradient(circle,#f97316,transparent)', filter:'blur(90px)' }}/>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full" style={{ background:'rgba(56,189,248,0.08)', border:'1px solid rgba(56,189,248,0.12)' }}>
              <ArrowLeft size={14} style={{ color:'#38bdf8' }}/>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">Hub</span>
          </Link>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.4em] font-black mb-0.5 text-sky-500/70">Flow State</p>
            <h1 className="text-2xl font-black text-white">Focus Mode</h1>
          </div>
        </div>

        {/* KPIs */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          className="grid grid-cols-4 py-6 mb-8"
          style={{ borderTop:'1px solid rgba(249,115,22,0.1)', borderBottom:'1px solid rgba(249,115,22,0.1)' }}>
          {[
            { label:'Focus Today',  val:stats.focusHoursToday,              color:'#38bdf8' },
            { label:'Pomodoros',    val:pomCount,                            color:'#f0f0f0' },
            { label:'Day Streak',   val:stats.streak,                        color:'#34d399' },
            { label:'Time Needed',  val:`${Math.round(totalNeeded*10)/10}h`, color:'#fbbf24' },
          ].map((s,i)=>(
            <div key={i} className="flex flex-col px-3"
              style={{ borderRight:i<3?'1px solid rgba(249,115,22,0.1)':'none' }}>
              <p className="text-[8px] uppercase tracking-[0.35em] mb-1.5 font-black text-neutral-700">{s.label}</p>
              <p className="text-2xl font-extralight tracking-tighter" style={{ color:s.color }}>{loading?'—':s.val}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT — Timer */}
          <div className="space-y-5">
            {/* Mode selector */}
            <div className="flex gap-2">
              {Object.entries(MODES).map(([key,mv])=>(
                <button key={key} onClick={()=>switchMode(key)}
                  className="flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all"
                  style={{
                    background: mode===key?`${mv.color}12`:'transparent',
                    border:`1px solid ${mode===key?`${mv.color}35`:'rgba(249,115,22,0.12)'}`,
                    color: mode===key?mv.color:'#6b7280',
                  }}>
                  {mv.label}
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="rounded-[2rem] p-8 flex flex-col items-center"
              style={{ background:'rgba(255,255,255,0.04)', border:`1.5px solid ${m.color}25` }}>
              <div className="relative flex items-center justify-center mb-5">
                <Ring seconds={seconds} total={m.mins*60} color={m.color}/>
                <div className="absolute flex flex-col items-center">
                  <p className="text-5xl font-black tracking-tighter tabular-nums" style={{ color:m.color }}>
                    {mins}:{secs}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mt-1">{m.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={reset}
                  className="p-3.5 rounded-2xl border transition-all"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <RotateCcw size={15} className="text-neutral-600"/>
                </button>
                <button onClick={()=>setIsActive(a=>!a)}
                  className="px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2"
                  style={{
                    background: isActive?`${m.color}12`:m.color,
                    color:      isActive?m.color:'#000',
                    border:     isActive?`1.5px solid ${m.color}40`:'none',
                    boxShadow:  !isActive?`0 0 20px ${m.color}30`:undefined,
                  }}>
                  {isActive?<><Pause size={15}/>Pause</>:<><Play size={15}/>Start</>}
                </button>
              </div>

              {/* Pom dots */}
              <div className="flex gap-2 mt-5 items-center">
                {Array.from({length:4}).map((_,i)=>(
                  <div key={i} className="w-2 h-2 rounded-full transition-all"
                    style={{ background:i<(pomCount%4)?m.color:'rgba(255,255,255,0.08)' }}/>
                ))}
                <p className="text-[10px] font-black ml-2 uppercase text-neutral-700">
                  {pomCount%4}/4 → long break
                </p>
                {saving && <Loader2 size={11} className="animate-spin text-neutral-700 ml-1"/>}
              </div>
            </div>

            {/* Time allocation */}
            {!loading && tasks.length>0 && (
              <div className="rounded-2xl p-5"
                style={{ background:'rgba(56,189,248,0.05)', border:'1px solid rgba(56,189,248,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={13} style={{ color:'#38bdf8' }}/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-500/70">Time Allocation</p>
                </div>
                <p className="text-sm text-neutral-500 mb-3">
                  Total to finish all tasks:
                  <span className="font-black text-sky-400 ml-1">{Math.round(totalNeeded*10)/10}h</span>
                </p>
                <div className="space-y-2">
                  {tasks.slice(0,4).map(t=>(
                    <div key={t._id} className="flex items-center justify-between gap-3">
                      <p className="text-xs text-neutral-600 truncate flex-1">{t.title}</p>
                      <span className="text-[10px] font-black text-sky-400 shrink-0">~{hoursLeft(t.progress)}h</span>
                      <span className="text-[9px] text-neutral-700 shrink-0">{sessNeeded(t.progress)} sess.</span>
                    </div>
                  ))}
                  {tasks.length>4 && <p className="text-[10px] text-neutral-700">+{tasks.length-4} more</p>}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* Task selector */}
            <div className="rounded-[2rem] p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700 mb-4">Focus On</p>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 size={18} className="animate-spin text-orange-500/60"/></div>
              ) : tasks.length===0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-600">No active tasks.</p>
                  <Link href="/productivity/tasks" className="text-xs font-black text-orange-500/60 mt-2 block hover:text-orange-400 transition-colors">Add tasks →</Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.map((t,i)=>{
                    const days = t.daysLeft ?? dl(t.deadline);
                    const color = sc(t.aiScore||0);
                    const sel = selIdx===i;
                    return (
                      <button key={t._id||i} onClick={()=>setSelIdx(i)}
                        className="w-full text-left p-3.5 rounded-2xl border transition-all"
                        style={{
                          background: sel?`${color}08`:'transparent',
                          border:`1px solid ${sel?`${color}35`:'rgba(249,115,22,0.08)'}`,
                        }}>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-sm font-bold truncate" style={{ color:sel?color:'#d4d4d4' }}>{t.title}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-black" style={{ color }}>{t.aiScore||0}</span>
                            <span className="text-[9px] text-neutral-700">{days!==null?(days<0?'Overdue':`${days}d`):'—'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
                            <div className="h-full rounded-full" style={{ width:`${t.progress}%`, background:color }}/>
                          </div>
                          <span className="text-[9px] text-neutral-700 shrink-0">{t.progress}% · ~{hoursLeft(t.progress)}h</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session log */}
            <div className="rounded-[2rem] p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Session Log</p>
                {sessions.length>0 && (
                  <span className="text-[10px] font-black" style={{ color:'#38bdf8' }}>
                    {sessions.filter(s=>s.type==='focus').length*25} min focused
                  </span>
                )}
              </div>
              {sessions.length===0 ? (
                <p className="text-sm text-center py-8 text-neutral-700">Complete a session to start logging.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sessions.map((s,i)=>(
                    <motion.div key={i} initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(249,115,22,0.08)' }}>
                      {s.type==='focus'
                        ?<Zap size={13} style={{ color:MODES.focus.color, flexShrink:0 }}/>
                        :<Coffee size={13} style={{ color:MODES[s.type].color, flexShrink:0 }}/>}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-300 truncate">
                          {s.type==='focus'?s.task:MODES[s.type].label}
                        </p>
                        <p className="text-[10px] text-neutral-700">{MODES[s.type].mins} min</p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:MODES[s.type].color }}/>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* AI nudge */}
            {task && (
              <div className="rounded-2xl p-5 flex items-start gap-3"
                style={{ background:'rgba(249,115,22,0.05)', border:'1px solid rgba(249,115,22,0.12)' }}>
                <Zap size={15} style={{ color:'#f97316', flexShrink:0, marginTop:2 }}/>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/70 mb-1">Focus Tip</p>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    {pomCount===0
                      ? `"${task.title}" has AI score ${task.aiScore||0}/100 — highest urgency. Start here.`
                      : pomCount<4
                      ? `${pomCount} session${pomCount>1?'s':''} done. ~${sessNeeded(task.progress)-pomCount} more to finish "${task.title}".`
                      : `Outstanding — ${pomCount} sessions completed. Take a long break, your brain has earned it.`}
                  </p>
                </div>
              </div>
            )}

            {/* Flow tips */}
            <div className="rounded-2xl p-5"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(249,115,22,0.08)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700 mb-3">Flow Tips</p>
              <div className="space-y-2">
                {[
                  'Work on the highest AI-scored task first.',
                  'One Pomodoro ≈ 0.5h of the estimated time above.',
                  'Close unrelated tabs. Phone in another room.',
                  'After 4 Pomodoros, take a 15-min long break.',
                ].map((tip,i)=>(
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] shrink-0 mt-0.5 text-orange-500/40">◈</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
