'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Plus, Trash2, Send, Receipt, SplitSquareHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SplitBillPage() {
  const [splits, setSplits] = useState([]);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [payer, setPayer] = useState('Me');
  
  // NEW: Toggle between Equal and Custom splits
  const [splitMethod, setSplitMethod] = useState('equal'); // 'equal' | 'custom'
  
  const [friends, setFriends] = useState([{ name: '', email: '', amount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSplits = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/splits');
      const data = await res.json();
      setSplits(data);
    } catch (error) { console.error("Failed to fetch splits"); }
  };

  useEffect(() => { fetchSplits(); }, []);

  const addFriend = () => setFriends([...friends, { name: '', email: '', amount: '' }]);
  const removeFriend = (index) => setFriends(friends.filter((_, i) => i !== index));
  
  const updateFriend = (index, field, value) => {
    const newFriends = [...friends];
    newFriends[index][field] = value;
    setFriends(newFriends);
  };

  // Calculate totals for validation
  const validFriends = friends.filter(f => f.name.trim() !== '');
  const totalCustomAssigned = validFriends.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const isOverBudget = splitMethod === 'custom' && totalCustomAssigned > parseFloat(totalAmount || 0);

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!title || !totalAmount) return;
    if (isOverBudget) return alert("Custom amounts exceed the total bill!");
    
    setIsSubmitting(true);
    
    let membersData = [];

    if (splitMethod === 'equal') {
      const totalPeople = validFriends.length + 1; // +1 for the payer
      const splitAmount = (parseFloat(totalAmount) / totalPeople).toFixed(2);
      membersData = validFriends.map(f => ({ ...f, amount: splitAmount }));
    } else {
      membersData = validFriends.map(f => ({ ...f, amount: parseFloat(f.amount || 0).toFixed(2) }));
    }

    try {
      await fetch('http://localhost:5000/api/splits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          total_amount: parseFloat(totalAmount),
          payer,
          members: membersData
        })
      });

      setTitle(''); setTotalAmount(''); setPayer('Me'); 
      setFriends([{ name: '', email: '', amount: '' }]);
      fetchSplits();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans relative overflow-hidden">
      
      {/* Premium Background Glow */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="mb-10">
          <Link href="/finance" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors mb-6 font-bold">
            <ArrowLeft size={20} /> Back to Hub
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-500/20 rounded-2xl border border-rose-500/30">
              <SplitSquareHorizontal className="text-rose-500" size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400">
                Advanced Splitter
              </h1>
              <p className="text-gray-400 mt-1">Divide equally or customize exact amounts.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* --- LEFT: THE FORM --- */}
          <div className="lg:col-span-3 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSplit} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">What was it for?</label>
                  <input required type="text" placeholder="e.g. Uber to Airport" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-rose-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Total Amount ($)</label>
                  <input required type="number" step="0.01" placeholder="0.00" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-rose-500 outline-none transition-colors text-rose-400 font-bold" />
                </div>
              </div>

              {/* Split Method Toggle */}
              <div className="bg-black/40 p-1.5 rounded-xl flex items-center border border-white/5">
                <button type="button" onClick={() => setSplitMethod('equal')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${splitMethod === 'equal' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                  Split Equally
                </button>
                <button type="button" onClick={() => setSplitMethod('custom')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${splitMethod === 'custom' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                  Custom Amounts
                </button>
              </div>

              {/* Friends List */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-400">Who owes you?</label>
                <AnimatePresence>
                  {friends.map((friend, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-3 items-center bg-black/20 p-2 rounded-2xl border border-white/5">
                      <input type="text" placeholder="Name" required value={friend.name} onChange={e => updateFriend(index, 'name', e.target.value)} className="w-1/3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500 outline-none text-sm" />
                      <input type="email" placeholder="Email (for auto-alert)" value={friend.email} onChange={e => updateFriend(index, 'email', e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500 outline-none text-sm" />
                      
                      {/* Show custom amount input ONLY if custom mode is selected */}
                      {splitMethod === 'custom' && (
                        <input type="number" step="0.01" placeholder="$ Owes" required value={friend.amount} onChange={e => updateFriend(index, 'amount', e.target.value)} className="w-24 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold rounded-xl px-3 py-3 focus:border-rose-500 outline-none text-sm text-center" />
                      )}

                      {friends.length > 1 && (
                        <button type="button" onClick={() => removeFriend(index)} className="p-3 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button type="button" onClick={addFriend} className="text-rose-400 text-sm font-bold flex items-center gap-1 mt-2 hover:text-rose-300 bg-rose-500/10 px-4 py-2 rounded-lg transition-colors">
                  <Plus size={16} /> Add Person
                </button>
              </div>

              {/* Summary Footer */}
              <div className="pt-6 mt-6 border-t border-white/10">
                {splitMethod === 'equal' ? (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Each person pays (including you):</span>
                    <span className="text-3xl font-bold text-rose-400">
                      ${totalAmount ? (totalAmount / (validFriends.length + 1)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total assigned to friends:</span>
                    <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-emerald-400'}`}>
                      ${totalCustomAssigned.toFixed(2)} / ${totalAmount || '0.00'}
                    </span>
                  </div>
                )}
                
                {isOverBudget && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle size={14}/> Friends cannot owe more than the total bill!</p>}

                <button type="submit" disabled={isSubmitting || isOverBudget} className="w-full mt-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                  {isSubmitting ? 'Processing...' : <><Send size={20} /> Save & Send Alerts</>}
                </button>
              </div>
            </form>
          </div>

          {/* --- RIGHT: HISTORY PANEL --- */}
          <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-fit max-h-[800px] overflow-y-auto custom-scrollbar">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Receipt className="text-rose-400" /> Recent Splits
             </h2>
             {splits.length === 0 ? (
               <div className="text-center py-10 bg-black/20 rounded-2xl border border-white/5">
                 <p className="text-gray-500">No active splits.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {splits.map(split => (
                   <div key={split.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-rose-500/30 transition-colors">
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <p className="font-bold text-lg text-white">{split.title}</p>
                         <p className="text-xs text-gray-500 mt-1">{new Date(split.date).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-rose-400 text-xl">${split.total_amount}</p>
                       </div>
                     </div>
                     <div className="pt-3 border-t border-white/10">
                       <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">People Owe You:</p>
                       <div className="space-y-2">
                         {split.members.map((m, i) => (
                           <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg">
                              <span className="text-sm text-gray-300 flex items-center gap-2"><Users size={12}/> {m.name}</span>
                              <span className="text-sm font-bold text-rose-300">${m.amount}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}