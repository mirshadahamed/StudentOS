'use client';
// frontend/components/Hero.jsx
// Place at: frontend/components/Hero.jsx

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Zap, TrendingUp, Clock, Check, Loader2 } from 'lucide-react';
import { tasksAPI } from '@/lib/api';

export default function Hero() {
  const [title,    setTitle]    = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('Medium');
  const [loading,  setLoading]  = useState(false);
  const [state,    setState]    = useState('idle'); // idle | success | error
  const [errMsg,   setErrMsg]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    // Client-side guard — this is what was causing "Add title first"
    if (!title.trim()) {
      setState('error');
      setErrMsg('Please enter a task title.');
      setTimeout(() => setState('idle'), 2500);
      return;
    }

    setLoading(true);

    const result = await tasksAPI.create({
      title:    title.trim(),
      deadline: deadline || null,
      category,
      priority,
      progress: 0,
    });

    setLoading(false);

    if (result && result._id) {
      // ✅ Task saved — clear form and show success
      setTitle('');
      setDeadline('');
      setCategory('Assignment');
      setPriority('Medium');
      setState('success');
      setTimeout(() => setState('idle'), 3000);
    } else {
      // ❌ Backend returned null — either network error or save failed
      setState('error');
      setErrMsg('Could not save task. Check the backend is running on port 5000.');
      setTimeout(() => setState('idle'), 4000);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border:     '1px solid rgba(249,115,22,0.2)',
    color:      'white',
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(135deg,#080808 0%,#100a06 100%)', fontFamily: 'system-ui,sans-serif' }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale:[1,1.2,1], opacity:[0.15,0.25,0.15] }}
          transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{ background:'radial-gradient(circle,#f97316,transparent)', filter:'blur(100px)' }}
        />
        <motion.div
          animate={{ scale:[1.1,1,1.1], opacity:[0.12,0.2,0.12] }}
          transition={{ duration:18, repeat:Infinity, ease:'easeInOut' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
          style={{ background:'radial-gradient(circle,#ec4899,transparent)', filter:'blur(110px)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* Hero header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
          className="text-center mb-14">
          <div className="inline-block mb-4 px-4 py-2 rounded-full"
            style={{ background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.3)' }}>
            <p className="text-xs font-black uppercase tracking-widest text-orange-400">Welcome to StudentOS</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4"
            style={{ background:'linear-gradient(135deg,#fb923c,#f97316,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Stay on Top of Your Game
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Track assignments, get AI-powered prioritisation, and never miss a deadline again.
          </p>
        </motion.div>

        {/* Quick Add form */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
          className="max-w-2xl mx-auto mb-16 rounded-3xl p-8"
          style={{ background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(249,115,22,0.2)', backdropFilter:'blur(10px)' }}>

          <div className="flex items-center gap-3 mb-6">
            <Plus size={20} style={{ color:'#f97316' }}/>
            <h2 className="text-xl font-bold">Quick Add Task</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="What task needs to be done? *"
                value={title}
                onChange={e => { setTitle(e.target.value); setState('idle'); setErrMsg(''); }}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl placeholder-neutral-600 outline-none font-medium disabled:opacity-50"
                style={{
                  ...inputStyle,
                  border: state === 'error' ? '1px solid rgba(239,68,68,0.5)' : inputStyle.border,
                }}
              />
              <AnimatePresence>
                {state === 'error' && errMsg && (
                  <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="text-xs text-red-400 mt-1.5">
                    {errMsg}
                  </motion.p>
                )}
                {state === 'success' && (
                  <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1.5">
                    <Check size={13}/> Task added and saved to MongoDB!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Category + deadline */}
            <div className="grid grid-cols-2 gap-4">
              <select value={category} onChange={e=>setCategory(e.target.value)} disabled={loading}
                className="px-4 py-3 rounded-xl outline-none font-medium disabled:opacity-50"
                style={inputStyle}>
                {['Assignment','Exam','Project','Lab Report','Presentation'].map(c=>(
                  <option key={c} style={{ background:'#111' }}>{c}</option>
                ))}
              </select>
              <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} disabled={loading}
                className="px-4 py-3 rounded-xl outline-none font-medium disabled:opacity-50"
                style={inputStyle}/>
            </div>

            {/* Priority */}
            <div className="flex gap-3">
              {['High','Medium','Low'].map(p => (
                <button key={p} type="button" onClick={()=>setPriority(p)}
                  className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all"
                  style={{
                    background: priority===p ? 'rgba(249,115,22,0.15)' : 'transparent',
                    border:     `1px solid ${priority===p ? 'rgba(249,115,22,0.4)' : 'rgba(249,115,22,0.15)'}`,
                    color:      priority===p ? '#f97316' : '#6b7280',
                  }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: state==='success' ? '#16a34a' : 'linear-gradient(135deg,#f97316,#ec4899)' }}>
              {loading ? <><Loader2 size={15} className="animate-spin"/>Saving...</>
               : state==='success' ? <><Check size={15}/>Saved!</>
               : <><Plus size={14}/>Add Task</>}
            </button>
          </form>

          <p className="text-xs text-neutral-700 mt-4 text-center">
            AI auto-scores urgency from deadline + priority. Leave priority as Medium to let AI assign it.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { icon:Zap,         title:'AI-Powered Scoring',  desc:'Urgency scores from 0–100 based on deadline proximity and priority level.' },
            { icon:TrendingUp,  title:'Progress Tracking',   desc:'Calendar heatmap and per-task progress bars synced with MongoDB.' },
            { icon:Clock,       title:'Smart Reminders',     desc:'Automated email reminders at 21, 14, 7, 3 and 1 day marks.' },
          ].map(({ icon:Icon, title:t, desc }, i) => (
            <div key={i} className="p-6 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(249,115,22,0.1)' }}>
              <Icon size={22} className="mb-3" style={{ color:'#f97316' }}/>
              <h3 className="font-bold text-base mb-2">{t}</h3>
              <p className="text-sm text-neutral-500">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.3 }}
          className="text-center">
          <Link href="/productivity"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5"
            style={{ background:'linear-gradient(135deg,#f97316,#ec4899)', color:'white' }}>
            Open Dashboard
            <ArrowRight size={16}/>
          </Link>
          <p className="text-neutral-700 text-sm mt-5">Add a task above or open the full dashboard</p>
        </motion.div>

      </div>
    </div>
  );
}