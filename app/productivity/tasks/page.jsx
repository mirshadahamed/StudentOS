'use client';
// frontend/app/productivity/tasks/page.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, X, Trash2, ChevronDown, ChevronUp,
  Loader2, AlertTriangle, Zap, Check, ListChecks
} from 'lucide-react';
import { tasksAPI } from '@/lib/api';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const dl         = (d) => d ? Math.ceil((new Date(d) - Date.now()) / 86400000) : null;
const urgency    = (days) => {
  if (days===null) return { label:'No Date',  color:'#6b7280', bar:'#374151' };
  if (days<0)      return { label:'Overdue',  color:'#ef4444', bar:'#ef4444' };
  if (days<=3)     return { label:'Critical', color:'#f43f5e', bar:'#f43f5e' };
  if (days<=7)     return { label:'Urgent',   color:'#fb923c', bar:'#fb923c' };
  if (days<=14)    return { label:'Soon',     color:'#fbbf24', bar:'#fbbf24' };
  if (days<=21)    return { label:'Upcoming', color:'#38bdf8', bar:'#38bdf8' };
  return                  { label:'Planned',  color:'#34d399', bar:'#34d399' };
};
const scoreColor  = (s) => s>=70?'#f43f5e':s>=50?'#fb923c':s>=30?'#fbbf24':'#34d399';
const priorityCol = { High:'#f43f5e', Medium:'#fbbf24', Low:'#34d399' };

// ─── INLINE ADD FORM ──────────────────────────────────────────────────────────
const AddForm = ({ onAdd, saving, saveError }) => {
  const [f, setF]       = useState({ title:'', course:'', deadline:'', category:'Assignment', priority:'Medium' });
  const [subs, setSubs] = useState(['','','']); // 3 default blank subtask rows
  const sf = (k,v) => setF(p=>({...p,[k]:v}));
  const updateSub = (i,val) => setSubs(s=>s.map((x,j)=>j===i?val:x));
  const addRow    = () => setSubs(s=>[...s,'']);
  const removeRow = (i) => setSubs(s=>s.filter((_,j)=>j!==i));

  const inp = { className:'rounded-xl px-3 py-2.5 text-sm outline-none font-medium w-full', style:{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(249,115,22,0.2)', color:'white' } };

  const handleAdd = () => {
    const cleanSubs = subs.filter(s=>s.trim()).map(s=>({ title:s.trim(), done:false }));
    onAdd({ ...f, subtasks: cleanSubs });
  };

  return (
    <div className="rounded-2xl p-5 mb-5" style={{ background:'rgba(249,115,22,0.04)', border:'1.5px solid rgba(249,115,22,0.25)' }}>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-orange-500/70">New Task</p>
      <div className="space-y-3">
        {/* Title */}
        <input {...inp} type="text" placeholder="Task title *" value={f.title} onChange={e=>sf('title',e.target.value)}/>

        {/* Course / Deadline / Category */}
        <div className="grid grid-cols-3 gap-3">
          <input {...inp} type="text" placeholder="Course (e.g. CS3012)" value={f.course} onChange={e=>sf('course',e.target.value)}/>
          <input {...inp} type="date" value={f.deadline} onChange={e=>sf('deadline',e.target.value)}/>
          <select {...inp} value={f.category} onChange={e=>sf('category',e.target.value)}>
            {['Assignment','Exam','Project','Lab Report','Presentation'].map(c=><option key={c} style={{ background:'#111' }}>{c}</option>)}
          </select>
        </div>

        {/* Priority */}
        <div className="flex gap-3">
          {['High','Medium','Low'].map(p=>(
            <button key={p} type="button" onClick={()=>sf('priority',p)}
              className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all"
              style={{ background:f.priority===p?'rgba(249,115,22,0.15)':'transparent', border:`1px solid ${f.priority===p?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.12)'}`, color:f.priority===p?'#f97316':'#6b7280' }}>
              {p}
            </button>
          ))}
        </div>

        {/* ─── Subtasks ──────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks size={12} style={{ color:'#f97316' }}/>
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Subtasks</p>
            <span className="text-[9px] text-neutral-700 ml-1">— break this task into steps (optional)</span>
          </div>
          <div className="space-y-1.5">
            {subs.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-700 w-4 text-right shrink-0">{i+1}.</span>
                <input type="text" placeholder={`Step ${i+1}`}
                  className="flex-1 rounded-xl px-3 py-2 text-xs outline-none font-medium"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.15)', color:'white' }}
                  value={val} onChange={e=>updateSub(i,e.target.value)}
                />
                {subs.length > 1 && (
                  <button type="button" onClick={()=>removeRow(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all shrink-0">
                    <X size={11} className="text-neutral-700"/>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow}
            className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all hover:text-orange-400"
            style={{ color:'rgba(249,115,22,0.5)' }}>
            <Plus size={10}/> Add step
          </button>
          <p className="text-[9px] mt-1.5 text-neutral-700">
            If you add steps, task progress is automatically calculated from how many you complete.
          </p>
        </div>

        {saveError && <p className="text-xs text-red-400">⚠ {saveError}</p>}

        <button disabled={!f.title.trim()||saving} onClick={handleAdd}
          className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          style={{ background:'linear-gradient(135deg,#f97316,#ec4899)' }}>
          {saving?<><Loader2 size={14} className="animate-spin"/>Saving...</>:'Log Task'}
        </button>
      </div>
    </div>
  );
};

// ─── TASK CARD ─────────────────────────────────────────────────────────────────
const TaskCard = ({ task, onToggle, onDelete, onSubtaskToggle, onProgressUpdate, index }) => {
  const [expanded,  setExpanded]  = useState(false);
  const [localProg, setLocalProg] = useState(task.progress ?? 0);

  // Keep progress in sync after subtask changes update the backend
  useEffect(() => { setLocalProg(task.progress ?? 0); }, [task.progress]);

  const days     = task.daysLeft ?? dl(task.deadline);
  const score    = task.aiScore ?? 0;
  const u        = urgency(days);
  const sc       = scoreColor(score);
  const subtasks = task.subtasks || [];
  const doneSubs = subtasks.filter(s => s.done).length;

  const commit   = async (pct) => { setLocalProg(pct); await onProgressUpdate(task._id, pct); };

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.03 }}
      className="rounded-2xl transition-all"
      style={{ background:task.isCompleted?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.04)', border:`1px solid ${task.isCompleted?'rgba(52,211,153,0.15)':days!==null&&days<=7?'rgba(244,63,94,0.25)':'rgba(249,115,22,0.15)'}`, opacity:task.isCompleted?0.7:1 }}>

      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        <button onClick={()=>onToggle(task._id,task.isCompleted)}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
          style={{ background:task.isCompleted?'#34d399':'transparent', borderColor:task.isCompleted?'#34d399':'rgba(249,115,22,0.3)' }}>
          {task.isCompleted&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>

        <div className="w-2 h-2 rounded-full shrink-0" style={{ background:u.color, boxShadow:days!==null&&days<=3?`0 0 6px ${u.color}`:undefined }}/>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color:task.isCompleted?'#6b7280':'#f0f0f0', textDecoration:task.isCompleted?'line-through':'none' }}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-[11px] text-neutral-600">{[task.course,task.category,task.priority+' priority'].filter(Boolean).join(' · ')}</p>
            {subtasks.length > 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                style={{ background:'rgba(249,115,22,0.1)', color:doneSubs===subtasks.length?'#34d399':'#fb923c' }}>
                {doneSubs}/{subtasks.length} steps
              </span>
            )}
          </div>
        </div>

        {!task.isCompleted && (
          <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl shrink-0" style={{ background:`${sc}12`, border:`1px solid ${sc}25` }}>
            <p className="text-sm font-black leading-none" style={{ color:sc }}>{score}</p>
            <p className="text-[7px] font-black uppercase text-neutral-700 mt-0.5">Score</p>
          </div>
        )}

        <div className="text-right shrink-0">
          <p className="text-sm font-black" style={{ color:u.color }}>{days===null?'—':days<0?'Overdue':`${days}d`}</p>
          <p className="text-[9px] uppercase font-black text-neutral-700">{u.label}</p>
        </div>

        <span className="text-[10px] font-black px-2 py-1 rounded-lg shrink-0"
          style={{ background:`${priorityCol[task.priority]||'#6b7280'}12`, border:`1px solid ${priorityCol[task.priority]||'#6b7280'}25`, color:priorityCol[task.priority]||'#6b7280' }}>
          {task.priority}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={()=>setExpanded(e=>!e)} className="p-1.5 rounded-lg transition-all hover:bg-white/5">
            {expanded?<ChevronUp size={13} className="text-neutral-600"/>:<ChevronDown size={13} className="text-neutral-600"/>}
          </button>
          <button onClick={()=>onDelete(task._id)} className="p-1.5 rounded-lg transition-all hover:bg-red-500/10">
            <Trash2 size={13} className="text-neutral-700"/>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
          <motion.div initial={{ width:0 }} animate={{ width:`${localProg}%` }} transition={{ duration:0.7 }}
            className="h-full rounded-full" style={{ background:task.isCompleted?'#34d399':u.bar }}/>
        </div>
        <p className="text-[10px] mt-1 text-neutral-700">
          {localProg}% complete
          {subtasks.length>0 && ` · ${doneSubs} of ${subtasks.length} steps done`}
        </p>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} className="overflow-hidden px-4 pb-5 pt-1"
            style={{ borderTop:'1px solid rgba(249,115,22,0.08)' }}>

            {/* Subtasks checklist */}
            {subtasks.length > 0 && (
              <div className="mb-4 pt-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <ListChecks size={13} style={{ color:'#f97316' }}/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Steps</p>
                  <div className="flex-1 h-px bg-white/5"/>
                  <span className="text-[10px] text-neutral-700">{doneSubs}/{subtasks.length}</span>
                </div>
                <div className="space-y-1.5">
                  {subtasks.map((sub, i) => (
                    <motion.div key={sub._id||i} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                      style={{ background:sub.done?'rgba(52,211,153,0.06)':'rgba(255,255,255,0.03)', border:`1px solid ${sub.done?'rgba(52,211,153,0.2)':'rgba(255,255,255,0.06)'}` }}
                      onClick={()=>onSubtaskToggle(task._id, sub._id, !sub.done)}>
                      <div className="flex items-center justify-center shrink-0 rounded-full border-2 transition-all"
                        style={{ width:'18px', height:'18px', background:sub.done?'#34d399':'transparent', borderColor:sub.done?'#34d399':'rgba(249,115,22,0.3)' }}>
                        {sub.done&&<svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <p className="text-xs flex-1" style={{ color:sub.done?'#6b7280':'#d4d4d4', textDecoration:sub.done?'line-through':'none' }}>
                        {sub.title}
                      </p>
                      {sub.done && <Check size={11} style={{ color:'#34d399' }} className="shrink-0"/>}
                    </motion.div>
                  ))}
                </div>
                {/* Subtask progress mini bar */}
                <div className="mt-2.5 h-1 rounded-full overflow-hidden bg-white/5">
                  <motion.div animate={{ width:`${subtasks.length>0?Math.round((doneSubs/subtasks.length)*100):0}%` }} transition={{ duration:0.5 }}
                    className="h-full rounded-full bg-emerald-400"/>
                </div>
              </div>
            )}

            {/* Manual progress (only if no subtasks) */}
            {subtasks.length === 0 && (
              <div className="pt-3">
                <p className="text-[10px] uppercase font-bold text-neutral-600 mb-2">Progress — {localProg}%</p>
                <input type="range" min="0" max="100" step="5" className="w-full" style={{ accentColor:'#f97316' }}
                  value={localProg}
                  onChange={e=>setLocalProg(Number(e.target.value))}
                  onMouseUp={e=>commit(Number(e.target.value))}
                  onTouchEnd={e=>commit(Number(e.target.value))}
                />
                <div className="flex gap-2 mt-2">
                  {[25,50,75,100].map(p=>(
                    <button key={p} onClick={()=>commit(p)}
                      className="flex-1 py-1.5 rounded-xl text-[10px] font-black border transition-all"
                      style={{ background:localProg>=p?'rgba(249,115,22,0.15)':'transparent', border:`1px solid ${localProg>=p?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.12)'}`, color:localProg>=p?'#f97316':'#6b7280' }}>
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {task.deadline && (
              <p className="text-[11px] text-neutral-600 mt-3">
                Due: {new Date(task.deadline).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AllTasksPage() {
  const [tasks,     setTasks]     = useState([]);
  const [stats,     setStats]     = useState({ total:0, completed:0, critical:0, prodScore:0, avgAiScore:0 });
  const [loading,   setLoading]   = useState(true);
  const [showAdd,   setShowAdd]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState('');
  const [sort,      setSort]      = useState('aiScore');

  const load = useCallback(async () => {
    setLoading(true);
    const [t, a] = await Promise.all([tasksAPI.getAll(), tasksAPI.getAnalytics()]);
    setTasks(t ?? []);
    setStats(a || { total:0, completed:0, critical:0, prodScore:0, avgAiScore:0 });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTask = async (form) => {
    setSaving(true); setSaveError('');
    const result = await tasksAPI.create(form);
    setSaving(false);
    if (result?._id) { await load(); setShowAdd(false); }
    else setSaveError('Save failed — check server config (e.g. `MONGO_URI`) and try again.');
  };

  const toggleTask = async (id, done) => {
    const r = await tasksAPI.update(id, { isCompleted:!done, progress:!done?100:0 });
    if (r) setTasks(p=>p.map(t=>t._id===id?{...t,...r}:t));
  };

  const deleteTask = async (id) => {
    await tasksAPI.delete(id);
    setTasks(p=>p.filter(t=>t._id!==id));
    load();
  };

  const updateProg = async (id, pct) => {
    const r = await tasksAPI.update(id, { progress:pct });
    if (r) setTasks(p=>p.map(t=>t._id===id?{...t,...r}:t));
  };

  const toggleSubtask = async (taskId, subtaskId, done) => {
    const r = await tasksAPI.toggleSubtask(taskId, subtaskId, done);
    if (r) setTasks(p=>p.map(t=>t._id===taskId?{...t,...r}:t));
  };

  const sorted = [...tasks].sort((a,b)=>{
    if (sort==='aiScore')  return (b.aiScore??0)-(a.aiScore??0);
    if (sort==='deadline') return (a.daysLeft??999)-(b.daysLeft??999);
    if (sort==='priority') return ({High:0,Medium:1,Low:2}[a.priority]??1)-({High:0,Medium:1,Low:2}[b.priority]??1);
    return 0;
  });

  const pending   = sorted.filter(t=>!t.isCompleted);
  const completed = sorted.filter(t=>t.isCompleted);

  const kpis = [
    { label:'Total',        val:stats.total,           color:'#f0f0f0' },
    { label:'Completed',    val:stats.completed,       color:'#34d399' },
    { label:'Critical',     val:stats.critical,        color:stats.critical>0?'#f43f5e':'#6b7280' },
    { label:'Productivity', val:`${stats.prodScore}%`, color:'#f97316' },
    { label:'Avg Score',    val:stats.avgAiScore,      color:'#ec4899' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background:'#080808', fontFamily:'system-ui,sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-8" style={{ background:'radial-gradient(circle,#f97316,transparent)', filter:'blur(80px)' }}/>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-6" style={{ background:'radial-gradient(circle,#ec4899,transparent)', filter:'blur(90px)' }}/>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

        {/* Nav — back to /productivity (the hub) */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/productivity" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full" style={{ background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.12)' }}>
              <ArrowLeft size={14} style={{ color:'#f97316' }}/>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">Hub</span>
          </Link>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.4em] font-black mb-0.5 text-orange-500/70">Academic Registry</p>
            <h1 className="text-2xl font-black text-white">All Tasks</h1>
          </div>
        </div>

        {/* KPIs */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          className="grid grid-cols-5 py-6 mb-6"
          style={{ borderTop:'1px solid rgba(249,115,22,0.1)', borderBottom:'1px solid rgba(249,115,22,0.1)' }}>
          {kpis.map((s,i)=>(
            <div key={i} className="flex flex-col px-3" style={{ borderRight:i<4?'1px solid rgba(249,115,22,0.1)':'none' }}>
              <p className="text-[8px] uppercase tracking-[0.35em] mb-1.5 font-black text-neutral-700">{s.label}</p>
              <p className="text-2xl font-extralight tracking-tighter" style={{ color:s.color }}>{loading?'—':s.val}</p>
            </div>
          ))}
        </motion.div>

        {/* Critical alert */}
        {stats.critical>0 && !loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4"
            style={{ background:'rgba(244,63,94,0.06)', border:'1px solid rgba(244,63,94,0.2)' }}>
            <AlertTriangle size={14} className="animate-pulse shrink-0 text-rose-400"/>
            <p className="text-sm text-rose-300/80">
              <span className="font-black">{stats.critical} task{stats.critical>1?'s':''} critical</span> — due within 7 days.
            </p>
          </motion.div>
        )}

        {/* Sort + Add */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-700">Sort:</p>
            {[['aiScore','AI Score'],['deadline','Deadline'],['priority','Priority']].map(([val,lbl])=>(
              <button key={val} onClick={()=>setSort(val)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all"
                style={{ background:sort===val?'rgba(249,115,22,0.12)':'transparent', border:`1px solid ${sort===val?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.12)'}`, color:sort===val?'#f97316':'#6b7280' }}>
                {lbl}
              </button>
            ))}
          </div>
          <button onClick={()=>{ setShowAdd(a=>!a); setSaveError(''); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            style={{ background:showAdd?'rgba(249,115,22,0.1)':'linear-gradient(135deg,#f97316,#ec4899)', color:showAdd?'#f97316':'white', border:`1px solid ${showAdd?'rgba(249,115,22,0.3)':'transparent'}` }}>
            {showAdd?<><X size={12}/>Cancel</>:<><Plus size={12}/>Add Task</>}
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden">
              <AddForm onAdd={addTask} saving={saving} saveError={saveError}/>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-orange-500/60"/></div>
        ) : tasks.length===0 ? (
          <div className="text-center py-16">
            <p className="text-base font-medium text-neutral-600">No tasks yet.</p>
            <p className="text-sm mt-1 text-neutral-700">Click "Add Task" to get started.</p>
          </div>
        ) : (
          <>
            {pending.length>0 && (
              <div className="space-y-2.5 mb-7">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700 mb-2">Active — {pending.length}</p>
                {pending.map((t,i)=>(
                  <TaskCard key={t._id} task={t} index={i}
                    onToggle={toggleTask} onDelete={deleteTask}
                    onSubtaskToggle={toggleSubtask} onProgressUpdate={updateProg}/>
                ))}
              </div>
            )}
            {completed.length>0 && (
              <div className="space-y-2.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700 mb-2">Completed — {completed.length}</p>
                {completed.map((t,i)=>(
                  <TaskCard key={t._id} task={t} index={i}
                    onToggle={toggleTask} onDelete={deleteTask}
                    onSubtaskToggle={toggleSubtask} onProgressUpdate={updateProg}/>
                ))}
              </div>
            )}
          </>
        )}

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background:'rgba(249,115,22,0.04)', border:'1px solid rgba(249,115,22,0.1)' }}>
          <Zap size={12} className="text-neutral-700"/>
          <p className="text-xs text-neutral-700">
            AI Score: days remaining (0–70) + priority bonus (High+30, Med+15). Checking off steps auto-updates task progress.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
