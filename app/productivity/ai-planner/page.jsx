'use client';
// frontend/app/productivity/ai-planner/page.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, Send, RefreshCw, ChevronDown, ChevronUp, Loader2, Calendar } from 'lucide-react';
import { tasksAPI, aiAPI } from '@/lib/api';

const dl = (d) => d ? Math.ceil((new Date(d) - Date.now()) / 86400000) : null;
const sc = (s) => s>=80?'#f43f5e':s>=60?'#fb923c':s>=40?'#fbbf24':s>=20?'#38bdf8':'#34d399';

// ─── SCORE RING ────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size=50 }) => {
  const r = (size-8)/2;
  const circ = 2*Math.PI*r;
  const color = sc(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5"/>
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset:circ }}
        animate={{ strokeDashoffset:circ-(circ*score/100) }}
        transition={{ duration:1, ease:'easeOut' }}
      />
    </svg>
  );
};

// ─── PRIORITY CARD ─────────────────────────────────────────────────────────
const PriCard = ({ task, rank, index }) => {
  const days  = task.daysLeft ?? dl(task.deadline);
  const color = sc(task.aiScore||0);
  return (
    <motion.div initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ delay:index*0.06 }}
      className="flex items-center gap-4 p-4 rounded-2xl transition-all"
      style={{
        background:'rgba(255,255,255,0.04)',
        border:`1px solid ${(task.aiScore||0)>=70?'rgba(244,63,94,0.2)':'rgba(249,115,22,0.12)'}`,
      }}>
      <div className="w-7 text-center shrink-0">
        <p className="text-base font-black" style={{ color:rank===1?'#fbbf24':rank===2?'#6b7280':rank===3?'#fb923c':'#374151' }}>#{rank}</p>
      </div>
      <div className="relative shrink-0 flex items-center justify-center">
        <ScoreRing score={task.aiScore||0} size={50}/>
        <div className="absolute">
          <p className="text-[11px] font-black" style={{ color }}>{task.aiScore||0}</p>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-100 truncate">{task.title}</p>
        <p className="text-[11px] text-neutral-600 mt-0.5">{task.course} · {task.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
            <div className="h-full rounded-full" style={{ width:`${task.progress}%`, background:color }}/>
          </div>
          <p className="text-[10px] text-neutral-600 shrink-0">{task.progress}%</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-black" style={{ color }}>{days!==null?(days<0?'Overdue':`${days}d`):'—'}</p>
        <p className="text-[9px] uppercase font-black text-neutral-700">{task.priority}</p>
      </div>
    </motion.div>
  );
};

// ─── SUGGESTION CARD ───────────────────────────────────────────────────────
const SuggCard = ({ s: sug, index }) => {
  const [expanded, setExpanded] = useState(false);
  const icons = { warning:'⚠', plan:'◈', insight:'↑', tip:'→' };
  const color = sug.score!=null ? sc(sug.score) : '#f97316';
  return (
    <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:index*0.07 }}
      className="rounded-2xl p-5 cursor-pointer transition-all"
      style={{ background:'rgba(249,115,22,0.05)', border:'1px solid rgba(249,115,22,0.15)' }}
      onClick={()=>setExpanded(e=>!e)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-sm shrink-0 mt-0.5" style={{ color:'#f97316' }}>{icons[sug.type]||'→'}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">{sug.tag}</p>
              {sug.score!=null && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                  style={{ background:`${color}15`, color, border:`1px solid ${color}25` }}>
                  {sug.score}/100
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">{sug.text}</p>
          </div>
        </div>
        <button className="text-neutral-700 hover:text-neutral-500 transition-colors shrink-0">
          {expanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
        </button>
      </div>
      <AnimatePresence>
        {expanded && sug.detail && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} className="overflow-hidden">
            <p className="text-xs text-neutral-600 mt-3 pt-3 leading-relaxed"
              style={{ borderTop:'1px solid rgba(249,115,22,0.08)' }}>
              {sug.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── CHAT BUBBLE ───────────────────────────────────────────────────────────
const Bubble = ({ msg }) => (
  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
    className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
    {msg.role==='assistant' && (
      <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"
        style={{ background:'rgba(236,72,153,0.12)', border:'1px solid rgba(236,72,153,0.2)' }}>
        <Brain size={13} className="text-pink-400"/>
      </div>
    )}
    <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
      style={{
        background: msg.role==='user'?'rgba(249,115,22,0.1)':'rgba(255,255,255,0.05)',
        border:`1px solid ${msg.role==='user'?'rgba(249,115,22,0.2)':'rgba(255,255,255,0.08)'}`,
        color:'#d4d4d4',
        borderBottomRightRadius: msg.role==='user'?'4px':undefined,
        borderBottomLeftRadius:  msg.role==='assistant'?'4px':undefined,
      }}>
      {msg.content}
      {msg.loading && (
        <span className="inline-flex gap-1 ml-2">
          {[0,1,2].map(i=>(
            <motion.span key={i} animate={{ opacity:[0.2,1,0.2] }}
              transition={{ duration:1.2, repeat:Infinity, delay:i*0.2 }}
              className="w-1 h-1 rounded-full bg-neutral-600 inline-block"/>
          ))}
        </span>
      )}
    </div>
  </motion.div>
);

// ─── WEEKLY PLAN ROW ───────────────────────────────────────────────────────
const PlanRow = ({ item, index }) => (
  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.05 }}
    className="flex items-start gap-4 py-3"
    style={{ borderBottom:'1px solid rgba(249,115,22,0.08)' }}>
    <div className="w-24 shrink-0">
      <p className="text-[10px] font-black text-neutral-300">{item.day?.split(' ')[0]}</p>
      <p className="text-[9px] text-neutral-700">{item.day?.split(' ').slice(1).join(' ')}</p>
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-neutral-200">{item.focus}</p>
      {item.note && <p className="text-[11px] text-neutral-600 mt-0.5">{item.note}</p>}
    </div>
    <p className="text-xs font-black shrink-0 text-orange-500/80">{item.hours}h</p>
  </motion.div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function AIPlannerPage() {
  const [tasks,       setTasks]       = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [weeklyPlan,  setWeeklyPlan]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [activeTab,   setActiveTab]   = useState('priority');
  const chatEndRef = useRef(null);

  const INIT_MSG = { role:'assistant', content:"Hi Sajana. I can see your tasks and their AI scores. Ask me what to work on first, how to plan your week, or anything about your deadlines." };
  const [messages,    setMessages]    = useState([INIT_MSG]);
  const [history,     setHistory]     = useState([]);
  const [input,       setInput]       = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(()=>{
    const load = async () => {
      const [t, s] = await Promise.all([tasksAPI.getAll({ completed:'false' }), aiAPI.getSuggestions()]);
      const sorted = (t??[]).sort((a,b)=>(b.aiScore||0)-(a.aiScore||0));
      setTasks(sorted);
      setSuggestions(s??[]);
      setLoading(false);
      if (sorted.length) {
        setMessages([{ role:'assistant', content:
          `I can see ${sorted.length} active task${sorted.length!==1?'s':''}. Top priority right now: "${sorted[0].title}" — AI score ${sorted[0].aiScore||0}/100, ${sorted[0].daysLeft??'TBD'} days left, ${sorted[0].progress}% done. What would you like to focus on?`
        }]);
      }
    };
    load();
  },[]);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({ behavior:'smooth' }); },[messages]);

  const loadPlan = async () => {
    if (weeklyPlan.length) return;
    setPlanLoading(true);
    const plan = await aiAPI.getWeeklyPlan();
    setWeeklyPlan(plan??[]);
    setPlanLoading(false);
  };

  const sendMessage = async (text) => {
    const msg = (text||input).trim();
    if (!msg||chatLoading) return;
    setInput('');
    setHistory(prev=>[...prev,{role:'user',content:msg}]);
    setMessages(prev=>[...prev,{role:'user',content:msg}]);
    setChatLoading(true);
    setMessages(prev=>[...prev,{role:'assistant',content:'',loading:true}]);
    try {
      const { reply } = await aiAPI.chat(msg, history);
      const aMsg = { role:'assistant', content:reply };
      setHistory(prev=>[...prev,aMsg]);
      setMessages(prev=>{ const u=[...prev]; u[u.length-1]=aMsg; return u; });
    } catch {
      setMessages(prev=>{ const u=[...prev]; u[u.length-1]={role:'assistant',content:'Connection error — is the backend running on port 5000?'}; return u; });
    } finally { setChatLoading(false); }
  };

  const tabs = [
    { id:'priority',    label:'Priority Rank' },
    { id:'suggestions', label:'Suggestions'   },
    { id:'plan',        label:'Weekly Plan'   },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background:'#080808', fontFamily:'system-ui,sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-8"
          style={{ background:'radial-gradient(circle,#ec4899,transparent)', filter:'blur(90px)' }}/>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-7"
          style={{ background:'radial-gradient(circle,#f97316,transparent)', filter:'blur(80px)' }}/>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/productivity" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full" style={{ background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.12)' }}>
              <ArrowLeft size={14} className="text-pink-500"/>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">Hub</span>
          </Link>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.4em] font-black mb-0.5 text-pink-500/70">System Intelligence</p>
            <h1 className="text-2xl font-black text-white">AI Planner</h1>
          </div>
        </div>

        {/* KPIs */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          className="grid grid-cols-4 py-6 mb-8"
          style={{ borderTop:'1px solid rgba(249,115,22,0.1)', borderBottom:'1px solid rgba(249,115,22,0.1)' }}>
          {[
            { label:'Active Tasks',   val:loading?'—':tasks.length,                                   color:'#f0f0f0' },
            { label:'Top Score',      val:loading||!tasks.length?'—':`${tasks[0]?.aiScore||0}/100`,   color:'#f43f5e' },
            { label:'Suggestions',   val:loading?'—':suggestions.length,                             color:'#ec4899' },
            { label:'High Priority',  val:loading?'—':tasks.filter(t=>t.priority==='High').length,    color:'#fbbf24' },
          ].map((s,i)=>(
            <div key={i} className="flex flex-col px-3"
              style={{ borderRight:i<3?'1px solid rgba(249,115,22,0.1)':'none' }}>
              <p className="text-[8px] uppercase tracking-[0.35em] mb-1.5 font-black text-neutral-700">{s.label}</p>
              <p className="text-2xl font-extralight tracking-tighter" style={{ color:s.color }}>{s.val}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map(tab=>(
                <button key={tab.id} onClick={()=>{ setActiveTab(tab.id); if(tab.id==='plan') loadPlan(); }}
                  className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all"
                  style={{
                    background: activeTab===tab.id?'rgba(236,72,153,0.1)':'transparent',
                    border:`1px solid ${activeTab===tab.id?'rgba(236,72,153,0.35)':'rgba(249,115,22,0.12)'}`,
                    color: activeTab===tab.id?'#ec4899':'#6b7280',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-[2rem] p-5"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(249,115,22,0.12)' }}>

              {activeTab==='priority' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"/>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-600">AI Priority Ranking</h3>
                  </div>
                  <p className="text-[10px] text-neutral-700 mb-4">
                    Score = days remaining → 0–70 pts + High +30, Medium +15, Low +0. Max 100.
                  </p>
                  {loading
                    ? <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-pink-500/60"/></div>
                    : tasks.length===0
                    ? <p className="text-sm text-neutral-600 text-center py-10">No tasks yet. Add tasks to get AI scoring.</p>
                    : <div className="space-y-3">{tasks.map((t,i)=><PriCard key={t._id} task={t} rank={i+1} index={i}/>)}</div>}
                </>
              )}

              {activeTab==='suggestions' && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"/>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-600">Active Suggestions</h3>
                  </div>
                  {loading
                    ? <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-orange-500/60"/></div>
                    : suggestions.length===0
                    ? <p className="text-sm text-neutral-600 text-center py-10">Add tasks to activate AI suggestions.</p>
                    : <div className="space-y-3">{suggestions.map((s,i)=><SuggCard key={i} s={s} index={i}/>)}</div>}
                </>
              )}

              {activeTab==='plan' && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={14} style={{ color:'#f97316' }}/>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-600">AI Weekly Study Plan</h3>
                  </div>
                  {planLoading
                    ? <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-orange-500/60"/></div>
                    : weeklyPlan.length===0
                    ? <p className="text-sm text-neutral-600 text-center py-10">Click this tab to generate your plan.</p>
                    : <div>{weeklyPlan.map((item,i)=><PlanRow key={i} item={item} index={i}/>)}</div>}
                </>
              )}
            </div>
          </div>

          {/* RIGHT — Chat */}
          <div className="rounded-[2rem] flex flex-col"
            style={{ height:'620px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(236,72,153,0.15)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom:'1px solid rgba(249,115,22,0.08)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)' }}>
                <Brain size={14} className="text-pink-400"/>
              </div>
              <div>
                <p className="text-sm font-black text-white">StudentOS Intelligence</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                  <span className="text-[10px] text-neutral-600">Claude · reads your live tasks</span>
                </div>
              </div>
              <button onClick={()=>{ setMessages([INIT_MSG]); setHistory([]); }}
                className="ml-auto text-neutral-700 hover:text-neutral-500 transition-colors">
                <RefreshCw size={13}/>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((msg,i)=><Bubble key={i} msg={msg}/>)}
              <div ref={chatEndRef}/>
            </div>

            {/* Quick prompts */}
            <div className="px-5 pb-3 flex gap-2 flex-wrap">
              {["What's most urgent?", 'Plan my week', 'Am I on track?', 'What to do first?'].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)}
                  className="text-[10px] px-3 py-1.5 rounded-xl border transition-all hover:border-orange-500/40 hover:text-orange-400"
                  style={{ border:'1px solid rgba(249,115,22,0.15)', color:'rgba(249,115,22,0.6)' }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 pb-5">
              <div className="flex gap-2 rounded-2xl px-4 py-3 transition-all"
                style={{ background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(249,115,22,0.15)' }}>
                <textarea rows={1} placeholder="Ask your planner anything..."
                  className="flex-1 bg-transparent text-sm outline-none resize-none text-neutral-300 placeholder:text-neutral-700"
                  value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();} }}
                />
                <button onClick={()=>sendMessage()} disabled={!input.trim()||chatLoading}
                  className="shrink-0 self-end transition-all"
                  style={{ color:input.trim()?'#ec4899':'#374151' }}>
                  {chatLoading?<Loader2 size={15} className="animate-spin"/>:<Send size={15}/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}