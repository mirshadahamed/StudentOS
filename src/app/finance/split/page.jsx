'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Plus, Trash2, Send, Receipt, SplitSquareHorizontal, AlertCircle } from 'lucide-react';

export default function SplitBillPage() {
  const [splits, setSplits] = useState([]);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [payer, setPayer] = useState('Me');
  
  // Toggle between Equal and Custom splits
  const [splitMethod, setSplitMethod] = useState('equal'); // 'equal' | 'custom'
  
  const [friends, setFriends] = useState([{ name: '', email: '', amount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified Validation State
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState({});

  // Regex for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchSplits = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/splits');
      const data = await res.json();
      setSplits(data);
    } catch (error) { console.error("Failed to fetch splits"); }
  };

  useEffect(() => { fetchSplits(); }, []);

  const addFriend = () => {
    setFriends([...friends, { name: '', email: '', amount: '' }]);
    setErrors([]); 
  };
  
  const removeFriend = (index) => {
    setFriends(friends.filter((_, i) => i !== index));
    setErrors([]); 
  };
  
  const updateFriend = (index, field, value) => {
    const newFriends = [...friends];
    newFriends[index][field] = value;
    setFriends(newFriends);
    if (errors.length > 0) setErrors([]); 
    if (Object.keys(errorFields).length > 0) setErrorFields({});
  };

  const validFriends = friends.filter(f => f.name.trim() !== '');
  const totalCustomAssigned = validFriends.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const isOverBudget = splitMethod === 'custom' && totalCustomAssigned > parseFloat(totalAmount || 0);

  // --- CUSTOM VALIDATION ENGINE ---
  const handleSplit = async (e) => {
    e.preventDefault();
    
    let newErrors = [];
    let newErrorFields = {};

    // 1. Check Title
    if (!title.trim()) {
      newErrors.push("Please specify what the bill was for.");
      newErrorFields.title = true;
    }

    // 2. Check Total Amount
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      newErrors.push("Please enter a valid total bill amount.");
      newErrorFields.totalAmount = true;
    }

    // 3. Check Friends List
    if (validFriends.length === 0) {
      newErrors.push("You must add at least one person to split the bill with.");
      newErrorFields.friends = true;
    }

    // 4. NEW: Check Emails Format
    const hasInvalidEmails = validFriends.some(f => !f.email || !emailRegex.test(f.email));
    if (hasInvalidEmails) {
      newErrors.push("Please enter a valid email address for everyone so we can send alerts.");
      newErrorFields.emails = true;
    }

    // 5. Check Custom Amounts & Budget
    if (splitMethod === 'custom') {
      const hasMissingAmounts = validFriends.some(f => !f.amount || parseFloat(f.amount) <= 0);
      if (hasMissingAmounts) {
        newErrors.push("Please enter a valid custom amount for all listed friends.");
        newErrorFields.customAmounts = true;
      }
      if (isOverBudget) {
        newErrors.push("Custom amounts exceed the total bill amount!");
        newErrorFields.budget = true;
      }
    }

    // Halt submission if there are errors
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setErrorFields(newErrorFields);
      return; 
    }

    // Pass Validation! Proceed with submission.
    setIsSubmitting(true);
    setErrors([]);
    setErrorFields({});
    
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
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 mt-4">
        
        <header className="mb-12">
          <Link href="/finance" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors mb-6 font-bold text-sm tracking-wider uppercase">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-500/10 rounded-[2rem] border border-rose-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <SplitSquareHorizontal className="text-rose-400 drop-shadow-[0_0_15px_rgba(225,29,72,0.6)]" size={42} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 tracking-tight">
                Advanced Splitter
              </h1>
              <p className="text-neutral-400 mt-2 text-lg">Divide bills equally or customize exact LKR amounts for friends.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* --- LEFT: THE FORM --- */}
          <div className="lg:col-span-3 bg-neutral-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] -mr-10 -mt-10" />
            
            <form onSubmit={handleSplit} noValidate className="space-y-6 relative z-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">What was it for?</label>
                  <input 
                    type="text" placeholder="e.g. PickMe to Galle Face" value={title} 
                    onChange={e => { setTitle(e.target.value); setErrors([]); setErrorFields({}); }} 
                    className={`w-full bg-black/60 border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 transition-all shadow-inner text-white 
                      ${errorFields.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-white/10 focus:border-rose-500/50 focus:ring-rose-500/10'}`} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Total Bill Amount</label>
                  <div className="relative group/input">
                    <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-bold text-xs transition-colors ${errorFields.totalAmount ? 'text-red-400' : 'text-neutral-500 group-focus-within/input:text-rose-400'}`}>LKR</span>
                    <input 
                      type="number" step="1" min="1" placeholder="0" value={totalAmount} 
                      onChange={e => { setTotalAmount(e.target.value); setErrors([]); setErrorFields({}); }} 
                      className={`w-full bg-black/60 border rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-4 transition-all text-rose-400 font-black text-xl shadow-inner
                        ${errorFields.totalAmount ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-white/10 focus:border-rose-500/50 focus:ring-rose-500/10'}`} 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-1.5 rounded-2xl flex items-center border border-white/5 shadow-inner">
                <button type="button" onClick={() => { setSplitMethod('equal'); setErrors([]); setErrorFields({}); }} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${splitMethod === 'equal' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'text-neutral-500 hover:text-white'}`}>
                  Split Equally
                </button>
                <button type="button" onClick={() => { setSplitMethod('custom'); setErrors([]); setErrorFields({}); }} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${splitMethod === 'custom' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'text-neutral-500 hover:text-white'}`}>
                  Custom Amounts
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Who owes you?</label>
                <AnimatePresence>
                  {friends.map((friend, index) => {
                    // Check if this specific friend has an email error
                    const isEmailInvalid = errorFields.emails && (!friend.email || !emailRegex.test(friend.email));
                    
                    return (
                      <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`flex gap-3 items-center bg-black/20 p-2 rounded-2xl border shadow-sm ${errorFields.friends && friend.name.trim() === '' ? 'border-red-500/50' : 'border-white/5'}`}>
                        <input 
                          type="text" placeholder="Name" value={friend.name} onChange={e => updateFriend(index, 'name', e.target.value)} 
                          className={`w-1/3 bg-black/40 border rounded-xl px-4 py-3.5 focus:outline-none text-sm text-white transition-colors ${errorFields.friends && friend.name.trim() === '' ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-rose-500'}`} 
                        />
                        
                        {/* EMAIL INPUT WITH REGEX VALIDATION COLORING */}
                        <input 
                          type="email" placeholder="Email (for auto-alert)" value={friend.email} onChange={e => updateFriend(index, 'email', e.target.value)} 
                          className={`flex-1 bg-black/40 border rounded-xl px-4 py-3.5 focus:outline-none text-sm text-white transition-colors ${isEmailInvalid ? 'border-red-500 focus:border-red-500 text-red-200' : 'border-white/10 focus:border-rose-500'}`} 
                        />
                        
                        {splitMethod === 'custom' && (
                          <div className="relative w-32">
                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${errorFields.customAmounts && !friend.amount ? 'text-red-400' : 'text-rose-500/50'}`}>LKR</span>
                            <input 
                              type="number" step="1" placeholder="0" value={friend.amount} onChange={e => updateFriend(index, 'amount', e.target.value)} 
                              className={`w-full bg-rose-500/10 border text-rose-400 font-bold rounded-xl pl-10 pr-3 py-3.5 outline-none text-sm transition-colors text-center ${errorFields.customAmounts && !friend.amount ? 'border-red-500 focus:border-red-500' : 'border-rose-500/30 focus:border-rose-500'}`} 
                            />
                          </div>
                        )}

                        {friends.length > 1 && (
                          <button type="button" onClick={() => removeFriend(index)} className="p-3 text-neutral-500 hover:text-red-400 transition-colors bg-white/5 rounded-xl ml-1">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                <button type="button" onClick={addFriend} className="text-rose-400 text-sm font-bold flex items-center gap-2 mt-3 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-5 py-3 rounded-xl transition-all border border-rose-500/20">
                  <Plus size={16} /> Add Person
                </button>
              </div>

              <div className="pt-8 mt-4 border-t border-white/5">
                {splitMethod === 'equal' ? (
                  <div className="flex justify-between items-center text-neutral-300 bg-black/40 p-5 rounded-2xl border border-white/5">
                    <span className="text-sm font-bold">Each person pays <span className="text-neutral-500 font-medium">(including you)</span>:</span>
                    <span className="text-3xl font-black text-rose-400">
                      LKR {totalAmount ? (totalAmount / (validFriends.length + 1)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5">
                    <span className="text-neutral-300 text-sm font-bold">Assigned to friends:</span>
                    <span className={`text-xl font-black tracking-wider ${isOverBudget ? 'text-red-500' : 'text-emerald-400'}`}>
                      LKR {totalCustomAssigned.toLocaleString()} <span className="text-neutral-600 text-lg">/ LKR {Number(totalAmount || 0).toLocaleString()}</span>
                    </span>
                  </div>
                )}
                
                {isOverBudget && <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-2 font-bold bg-red-500/10 p-3 rounded-xl"><AlertCircle size={16}/> Friends cannot owe more than the total bill!</p>}

                {/* --- UNIFIED MULTI-ERROR DISPLAY --- */}
                <AnimatePresence>
                  {errors.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-red-500/10 border border-red-500/30 rounded-2xl overflow-hidden"
                    >
                      <div className="p-4 flex gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-red-400 font-bold mb-1">Please fix the following to proceed:</p>
                          <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                            {errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={isSubmitting || isOverBudget} className="w-full mt-6 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)] active:scale-95">
                  {isSubmitting ? 'Processing Network...' : <><Send size={22} /> Save & Send Alerts</>}
                </button>
              </div>
            </form>
          </div>

          {/* --- RIGHT: HISTORY PANEL --- */}
          <div className="lg:col-span-2 bg-neutral-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 h-fit max-h-[800px] overflow-y-auto custom-scrollbar shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] -mr-10 -mt-10" />
             
             <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white relative z-10">
                <Receipt className="text-rose-400" size={24} /> Recent Splits
             </h2>
             
             <div className="relative z-10">
               {splits.length === 0 ? (
                 <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                   <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                     <Receipt size={24} className="text-neutral-600" />
                   </div>
                   <p className="text-neutral-500 font-bold">No active splits found.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {splits.map(split => (
                     <div key={split.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-rose-500/30 transition-colors shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <p className="font-bold text-lg text-white">{split.title}</p>
                           <p className="text-xs text-neutral-500 mt-1 font-medium">{new Date(split.date).toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                           <p className="font-black text-rose-400 text-xl">LKR {Number(split.total_amount).toLocaleString()}</p>
                         </div>
                       </div>
                       
                       <div className="pt-4 border-t border-white/5">
                         <p className="text-xs text-neutral-500 mb-3 uppercase tracking-widest font-bold">People Owe You</p>
                         <div className="space-y-2">
                           {split.members.map((m, i) => (
                             <div key={i} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                <span className="text-sm text-neutral-300 flex items-center gap-2 font-medium"><Users size={14} className="text-neutral-500"/> {m.name}</span>
                                <span className="text-sm font-bold text-rose-300">LKR {Number(m.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
    </div>
  );
}