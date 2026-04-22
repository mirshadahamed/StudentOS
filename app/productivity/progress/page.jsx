'use client';
// frontend/app/productivity/progress/page.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, TrendingUp, AlertTriangle,
  CheckCircle2, Loader2, BellRing, RefreshCw
} from 'lucide-react';
import { tasksAPI } from '@/lib/api';

const dl = (d) => d ? Math.ceil((new Date(d) - Date.now()) / 86400000) : null;
const barCol = (days) => {
  if (days===null) return '#6b7280';
  if (days<0)   return '#ef4444';
  if (days<=3)  return '#f43f5e';
  if (days<=7)  return '#fb923c';
  if (days<=14) return '#fbbf24';
  if (days<=21) return '#38bdf8';
  return '#34d399';
};

// ─── CALENDAR HEATMAP ────────────────────────────────────────────────────────
const CalHeatmap = ({ tasks }) => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 28); // 5 weeks back
  const days35 = Array.from({length:35},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d; });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
          <p key={d} className="text-[9px] font-black uppercase text-center text-neutral-700">{d}</p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days35.map((d,i)=>{
          const isToday  = d.toDateString()===today.toDateString();
          const isPast   = d<today && !isToday;
          const dayTasks = tasks.filter(t=>t.deadline && new Date(t.deadline).toDateString()===d.toDateString());
          const urgent   = dayTasks.some(t=>{ const x=dl(t.deadline); return x!==null&&x<=7; });
          const count    = dayTasks.length;
          return (
            <div key={i}
              title={count>0?dayTasks.map(t=>t.title).join(', '):d.toLocaleDateString('en-GB')}
              className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-default transition-all"
              style={{
                background: count>0
                  ? (urgent?'rgba(244,63,94,0.18)':'rgba(249,115,22,0.14)')
                  : isToday?'rgba(249,115,22,0.08)':'rgba(255,255,255,0.02)',
                border:`1px solid ${isToday?'rgba(249,115,22,0.5)':count>0?(urgent?'rgba(244,63,94,0.3)':'rgba(249,115,22,0.25)'):'rgba(255,255,255,0.05)'}`,
                opacity: isPast&&count===0?0.35:1,
                boxShadow: isToday?'0 0 0 2px rgba(249,115,22,0.2)':undefined,
              }}>
              <p className="text-[10px] font-black"
                style={{ color:isToday?'#f97316':count>0?(urgent?'#f43f5e':'#fb923c'):'#6b7280' }}>
                {d.getDate()}
              </p>
              {count>0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({length:Math.min(count,3)}).map((_,j)=>(
                    <div key={j} className="w-1 h-1 rounded-full" style={{ background:urgent?'#f43f5e':'#f97316' }}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-5 mt-3 flex-wrap">
        {[
          { bg:'rgba(244,63,94,0.18)',  border:'rgba(244,63,94,0.3)',   label:'Urgent deadline' },
          { bg:'rgba(249,115,22,0.14)', border:'rgba(249,115,22,0.25)', label:'Upcoming deadline' },
          { bg:'transparent',           border:'rgba(249,115,22,0.5)',   label:'Today' },
        ].map((l,i)=>(
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md" style={{ background:l.bg, border:`1px solid ${l.border}` }}/>
            <p className="text-[10px] text-neutral-600">{l.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PROGRESS CARD ────────────────────────────────────────────────────────────
const ProgCard = ({ task, index }) => {
  const days  = task.daysLeft ?? dl(task.deadline);
  const color = barCol(days);
  const score = task.aiScore ?? 0;
  const sc    = score>=70?'#f43f5e':score>=50?'#fb923c':score>=30?'#fbbf24':'#34d399';

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.04 }}
      className="rounded-2xl p-5"
      style={{
        background:'rgba(255,255,255,0.04)',
        border:`1px solid ${task.isCompleted?'rgba(52,211,153,0.15)':days!==null&&days<=7?'rgba(244,63,94,0.2)':'rgba(249,115,22,0.12)'}`,
      }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.isCompleted
              ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0"/>
              : <div className="w-2 h-2 rounded-full shrink-0" style={{ background:color }}/>}
            <p className="text-sm font-bold truncate"
              style={{ color:task.isCompleted?'#6b7280':'#f0f0f0', textDecoration:task.isCompleted?'line-through':'none' }}>
              {task.title}
            </p>
          </div>
          <p className="text-[11px] text-neutral-600">
            {[task.course, task.category, task.priority+' priority'].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-extralight tracking-tighter" style={{ color:task.isCompleted?'#34d399':color }}>
            {task.isCompleted?'✓':days!==null?(days<0?'Past':`${days}d`):'—'}
          </p>
          <p className="text-[9px] uppercase font-black text-neutral-700">
            {task.isCompleted?'done':'remaining'}
          </p>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-1.5 bg-white/5">
        <motion.div initial={{ width:0 }} animate={{ width:`${task.progress}%` }} transition={{ duration:0.8, ease:'easeOut' }}
          className="h-full rounded-full" style={{ background:task.isCompleted?'#34d399':color }}/>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-neutral-600">{task.progress}% complete</p>
        {!task.isCompleted && task.deadline && (
          <p className="text-[11px] text-neutral-600">
            {new Date(task.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
          </p>
        )}
      </div>

      {!task.isCompleted && (
        <div className="mt-2.5 flex items-center gap-2">
          <p className="text-[9px] font-black uppercase text-neutral-700 shrink-0">AI Score</p>
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
            <div className="h-full rounded-full" style={{ width:`${score}%`, background:sc }}/>
          </div>
          <p className="text-[10px] font-black shrink-0" style={{ color:sc }}>{score}/100</p>
        </div>
      )}
    </motion.div>
  );
};

// ─── TIMELINE ────────────────────────────────────────────────────────────────
const Timeline = ({ tasks }) => {
  const pending = [...tasks].filter(t=>!t.isCompleted&&t.deadline).sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));
  if (!pending.length) return <p className="text-center py-10 text-sm text-neutral-600">No upcoming deadlines.</p>;
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/8"/>
      <div className="space-y-3">
        {pending.map((t,i)=>{
          const days  = t.daysLeft ?? dl(t.deadline);
          const color = barCol(days);
          return (
            <div key={t._id} className="flex items-start gap-4 pl-4 relative">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-0.5 shrink-0"
                style={{ background:color, boxShadow:`0 0 0 3px #080808, 0 0 0 4.5px ${color}50` }}/>
              <div className="flex-1 rounded-2xl px-4 py-3"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.1)' }}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-100 truncate">{t.title}</p>
                    <p className="text-[11px] text-neutral-600">
                      {new Date(t.deadline).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})} · {t.course}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black" style={{ color }}>{days<0?'Overdue':`${days}d`}</p>
                    <p className="text-[9px] text-neutral-700">Score: {t.aiScore??0}/100</p>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-white/5">
                  <div className="h-full rounded-full" style={{ width:`${t.progress}%`, background:color }}/>
                </div>
                <p className="text-[10px] mt-1 text-neutral-700">{t.progress}% done</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [view,    setView]    = useState('grid');

  const load = async () => { setLoading(true); const t = await tasksAPI.getAll(); setTasks(t??[]); setLoading(false); };
  useEffect(()=>{ load(); }, []);

  const pending  = tasks.filter(t=>!t.isCompleted);
  const done     = tasks.filter(t=>t.isCompleted);
  const overdue  = pending.filter(t=>{ const d=t.daysLeft??dl(t.deadline); return d!==null&&d<0; });
  const critical = pending.filter(t=>{ const d=t.daysLeft??dl(t.deadline); return d!==null&&d>=0&&d<=7; });
  const avgProg  = pending.length ? Math.round(pending.reduce((a,t)=>a+t.progress,0)/pending.length) : 0;

  const kpis = [
    { label:'Active',    val:pending.length,   color:'#f97316' },
    { label:'Completed', val:done.length,       color:'#34d399' },
    { label:'Overdue',   val:overdue.length,    color:overdue.length>0?'#ef4444':'#6b7280' },
    { label:'Critical',  val:critical.length,   color:critical.length>0?'#f43f5e':'#6b7280' },
    { label:'Avg Prog',  val:`${avgProg}%`,     color:'#fb923c' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background:'#080808', fontFamily:'system-ui,sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-8"
          style={{ background:'radial-gradient(circle,#fb923c,transparent)', filter:'blur(80px)' }}/>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-6"
          style={{ background:'radial-gradient(circle,#ec4899,transparent)', filter:'blur(90px)' }}/>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/productivity" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full" style={{ background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <ArrowLeft size={14} style={{ color:'#f97316' }}/>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={load}
              className="p-2 rounded-full transition-all"
              style={{ background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <RefreshCw size={13} style={{ color:'#f97316' }}/>
            </button>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.4em] font-black mb-0.5 text-orange-500/70">Deadline Tracker</p>
              <h1 className="text-2xl font-black text-white">Progress</h1>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          className="grid grid-cols-5 py-6 mb-6"
          style={{ borderTop:'1px solid rgba(249,115,22,0.1)', borderBottom:'1px solid rgba(249,115,22,0.1)' }}>
          {kpis.map((s,i)=>(
            <div key={i} className="flex flex-col px-3"
              style={{ borderRight:i<4?'1px solid rgba(249,115,22,0.1)':'none' }}>
              <p className="text-[8px] uppercase tracking-[0.35em] mb-1.5 font-black text-neutral-700">{s.label}</p>
              <p className="text-2xl font-extralight tracking-tighter" style={{ color:s.color }}>{loading?'—':s.val}</p>
            </div>
          ))}
        </motion.div>

        {/* Alert */}
        {(overdue.length>0||critical.length>0) && !loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
            style={{ background:'rgba(244,63,94,0.06)', border:'1px solid rgba(244,63,94,0.2)' }}>
            <AlertTriangle size={14} className="animate-pulse shrink-0 text-rose-400"/>
            <p className="text-sm flex-1 text-rose-300/80">
              {overdue.length>0 && <span className="font-black">{overdue.length} overdue. </span>}
              {critical.length>0 && <span className="font-black">{critical.length} critical ≤7 days. </span>}
              <Link href="/productivity/tasks" className="underline ml-1 font-black">Update progress →</Link>
            </p>
          </motion.div>
        )}

        {/* Calendar */}
        <div className="rounded-[2rem] p-6 mb-5"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.12)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={14} style={{ color:'#fb923c' }}/>
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-600">Deadline Calendar — 5 Week View</h3>
          </div>
          {loading
            ? <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-orange-500/60"/></div>
            : <CalHeatmap tasks={tasks}/>}
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-neutral-600">
            <TrendingUp size={13} style={{ color:'#fb923c' }}/> Task Progress
          </h3>
          <div className="flex gap-2">
            {['grid','timeline'].map(v=>(
              <button key={v} onClick={()=>setView(v)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all"
                style={{
                  background: view===v?'rgba(249,115,22,0.1)':'transparent',
                  border:`1px solid ${view===v?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.12)'}`,
                  color: view===v?'#f97316':'#6b7280',
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {loading
          ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-orange-500/60"/></div>
          : tasks.length===0
          ? <div className="text-center py-16">
              <p className="text-sm text-neutral-600">No tasks yet.</p>
              <Link href="/productivity/tasks" className="text-sm font-black text-orange-500/70 mt-2 block hover:text-orange-400 transition-colors">Add tasks →</Link>
            </div>
          : view==='grid'
          ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...pending,...done].sort((a,b)=>(b.aiScore??0)-(a.aiScore??0)).map((t,i)=><ProgCard key={t._id} task={t} index={i}/>)}
            </div>
          : <div className="rounded-[2rem] p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <Timeline tasks={tasks}/>
            </div>}

        {/* Footer */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background:'rgba(249,115,22,0.04)', border:'1px solid rgba(249,115,22,0.08)' }}>
          <BellRing size={12} className="text-neutral-700"/>
          <p className="text-xs text-neutral-700">
            Email reminders fire at 21, 14, 7, 3 and 1 day marks. Progress from Tasks page syncs here instantly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}