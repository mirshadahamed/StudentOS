'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingDown, Plus, Calendar, 
  CheckCircle2, Clock, X, Bell, AlertTriangle, Search,
  Edit2, Trash2 // Added new icons here!
} from 'lucide-react';
import ExpenseRain from '../../../components/ExpenseRain';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed'

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing!
  const [formData, setFormData] = useState({ 
    title: '', amount: '', category: 'Housing', status: 'pending', dueDate: '' 
  });

  // 1. Fetch Data & Parse the Secret Due Date
  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions');
      const data = await res.json();
      
      const expenseOnly = data
        .filter(t => t.type === 'expense')
        .map(exp => {
          let actualStatus = exp.status;
          let dueDate = null;
          if (exp.status && exp.status.includes('|')) {
            [actualStatus, dueDate] = exp.status.split('|');
          }
          return { ...exp, status: actualStatus, dueDate };
        });

      setExpenses(expenseOnly);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  // 2. Close Modal & Reset Form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', amount: '', category: 'Housing', status: 'pending', dueDate: '' });
  };

  // 3. Add or Update Expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const statusToSave = formData.status === 'pending' && formData.dueDate 
      ? `pending|${formData.dueDate}` 
      : formData.status;

    const payload = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: 'expense',
      category: formData.category,
      status: statusToSave 
    };

    try {
      if (editingId) {
        // UPDATE Existing
        await fetch(`http://localhost:5000/api/transactions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE New
        await fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      await fetchExpenses();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Edit Action
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category || 'Housing',
      status: expense.status || 'pending',
      dueDate: expense.dueDate || ''
    });
    setIsModalOpen(true);
  };

  // 5. Delete Action
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bill permanently?")) return;
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' });
      fetchExpenses();
    } catch (err) { console.error(err); }
  };

  // --- Calculations ---
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = expenses.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const paidAmount = expenses.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const progressPercent = totalExpenses === 0 ? 0 : (paidAmount / totalExpenses) * 100;

  const urgentBills = expenses.filter(t => {
    if (t.status !== 'pending' || !t.dueDate) return false;
    const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  });

  // --- Search & Filter Logic ---
  const filteredExpenses = expenses.filter(exp => {
    const matchesTab = activeTab === 'all' || exp.status === activeTab;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans p-8">
      
      {/* Background Red Glow & Rain Effect */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
      <ExpenseRain />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- SMART ALERT BANNER --- */}
        <AnimatePresence>
          {urgentBills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                  <Bell className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-red-400 font-bold">Action Required</h3>
                  <p className="text-sm text-gray-300">You have {urgentBills.length} bill(s) due very soon or overdue!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- HEADER --- */}
        <header className="mb-10">
          <Link href="/finance" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors mb-6 font-bold">
            <ArrowLeft size={20} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400"
              >
                Upcoming Expenses
              </motion.h1>
              <p className="text-gray-400 mt-2 text-lg">Track your bills, subscriptions, and deadlines.</p>
            </div>

            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={() => setIsModalOpen(true)}
              className="group bg-rose-600 hover:bg-rose-500 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add New Bill
            </motion.button>
          </div>
        </header>

        {/* --- PROGRESS BAR SECTION --- */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Liability</p>
              <p className="text-3xl font-bold">LKR {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-500 text-sm font-bold uppercase tracking-wider mb-1">Cleared</p>
              <p className="text-xl font-bold text-white">LKR {paidAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>

        {/* --- CONTROLS: SEARCH & TABS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex bg-black/50 border border-white/10 rounded-xl p-1.5 w-full md:w-auto">
            <button onClick={() => setActiveTab('all')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveTab('pending')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Pending</button>
            <button onClick={() => setActiveTab('completed')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Paid</button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" placeholder="Search bills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        {/* --- EXPENSE LIST --- */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your bills...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-gray-400 text-xl font-bold mb-2">No expenses found! 🎉</p>
              <p className="text-gray-500">You are all caught up.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredExpenses.map((item) => {
                
                // Urgency Logic Math
                let daysLeftText = "";
                let urgencyClass = "border-white/10 hover:border-rose-500/50";
                let iconColor = "bg-rose-500/20 text-rose-400";
                let statusTextClass = "text-emerald-500";

                if (item.status === 'pending') {
                  statusTextClass = "text-orange-400";
                  iconColor = "bg-orange-500/20 text-orange-400";
                  urgencyClass = "border-orange-500/30 hover:border-orange-500/60";

                  if (item.dueDate) {
                    const daysLeft = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                    if (daysLeft < 0) {
                      daysLeftText = `Overdue by ${Math.abs(daysLeft)} days!`;
                      urgencyClass = "border-red-500/50 bg-red-500/5";
                      iconColor = "bg-red-500/20 text-red-500";
                      statusTextClass = "text-red-500";
                    } else if (daysLeft === 0) {
                      daysLeftText = "Due Today!";
                      urgencyClass = "border-rose-500/50";
                      iconColor = "bg-rose-500/20 text-rose-400";
                      statusTextClass = "text-rose-400";
                    } else {
                      daysLeftText = `Due in ${daysLeft} days`;
                      if (daysLeft <= 3) {
                        urgencyClass = "border-rose-500/40";
                        iconColor = "bg-rose-500/20 text-rose-400";
                        statusTextClass = "text-rose-400";
                      }
                    }
                  }
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                    key={item.id}
                    className={`bg-white/5 backdrop-blur-md border p-6 rounded-3xl flex items-center justify-between group transition-all ${urgencyClass}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor}`}>
                        {daysLeftText.includes("Overdue") ? <AlertTriangle size={24} /> : <TrendingDown size={24} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                          {item.title}
                          {item.status === 'pending' && <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${iconColor}`}>Unpaid</span>}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {item.category}</span>
                          {item.dueDate && (
                            <>
                              <span className="w-1 h-1 bg-gray-600 rounded-full" />
                              <span className={statusTextClass}>{daysLeftText}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-2xl font-bold text-rose-400">-LKR {item.amount.toLocaleString()}</p>
                      
                      <div className={`flex items-center justify-end gap-1 text-xs font-bold mt-1 uppercase tracking-wider ${statusTextClass}`}>
                        {item.status === 'pending' ? <><Clock size={12}/> {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Pending'}</> : <><CheckCircle2 size={12}/> Paid</>}
                      </div>

                      {/* NEW: Edit & Delete Hover Actions */}
                      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 border border-white/5 hover:bg-amber-500/20 hover:border-amber-500/30 text-amber-500 rounded-xl transition-all shadow-sm">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 border border-white/5 hover:bg-rose-500/20 hover:border-rose-500/30 text-rose-500 rounded-xl transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT EXPENSE MODAL UI --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <button onClick={handleCloseModal} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <TrendingDown className="text-rose-500" /> 
                {editingId ? 'Edit Bill' : 'New Expense'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Bill Name</label>
                  <input type="text" required placeholder="e.g. Boarding Fees, WiFi" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">LKR</span>
                      <input type="number" required min="1" step="0.01" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none">
                      <option value="Housing">Housing</option>
                      <option value="Food">Food</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Transport">Transport</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Payment Status</label>
                  <div className="flex bg-black/50 border border-white/10 rounded-xl p-1 mb-4">
                    <button type="button" onClick={() => setFormData({...formData, status: 'pending'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.status === 'pending' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-white'}`}>
                      Due Soon
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, status: 'completed'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.status === 'completed' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:text-white'}`}>
                      Already Paid
                    </button>
                  </div>

                  {/* DEADLINE SELECTOR (Only shows if 'Due Soon' is selected) */}
                  <AnimatePresence>
                    {formData.status === 'pending' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <label className="block text-sm font-bold text-rose-400 mb-2">Deadline (Optional)</label>
                        <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-300 focus:outline-none focus:border-rose-500 transition-colors custom-calendar-icon" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2">
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Expense' : 'Save Expense')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}