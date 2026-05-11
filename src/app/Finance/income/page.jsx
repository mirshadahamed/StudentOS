'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wallet, Plus, Calendar, 
  ArrowUpRight, X, Search, Edit2, Trash2, 
  TrendingUp, Award, Zap
} from 'lucide-react';
import MoneyRain from '@/components/MoneyRain';
import { withUserBody, withUserQuery } from '../apiClient';

export default function IncomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'work', 'allowance', 'other'

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Work' });

  // 1. Fetch Data
  const fetchIncome = async () => {
    try {
      const res = await fetch(withUserQuery('/api/finance/transactions'));
      const data = await res.json();
      const incomeOnly = data.filter(t => t.type === 'income');
      setTransactions(incomeOnly);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // 2. Close Modal & Reset
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', amount: '', category: 'Work' });
  };

  // 3. Add or Update Income
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: 'income',
      category: formData.category,
      status: 'received'
    };

    try {
      if (editingId) {
        // UPDATE Existing
        await fetch(withUserQuery(`/api/finance/transactions/${editingId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withUserBody(payload)),
        });
      } else {
        // CREATE New
        await fetch('/api/finance/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withUserBody(payload)),
        });
      }

      await fetchIncome();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Edit Action
  const handleEdit = (income) => {
    setEditingId(income.id);
    setFormData({
      title: income.title,
      amount: income.amount,
      category: income.category || 'Work'
    });
    setIsModalOpen(true);
  };

  // 5. Delete Action
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this income record?")) return;
    try {
      await fetch(withUserQuery(`/api/finance/transactions/${id}`), { method: 'DELETE' });
      fetchIncome();
    } catch (err) { console.error(err); }
  };

  // --- Calculations & Insights ---
  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Find Top Category
  const categoryCounts = transactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const topCategory = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b) 
    : 'None';

  // --- Search & Filter Logic ---
  const filteredIncome = transactions.filter(inc => {
    const matchesTab = activeTab === 'all' || (inc.category && inc.category.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans p-8">
      
      <MoneyRain />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-10">
          <Link href="/finance" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6 font-bold">
            <ArrowLeft size={20} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
              >
                Income Streams
              </motion.h1>
              <p className="text-gray-400 mt-2 text-lg">Track your hustle, allowances, and wealth generation.</p>
            </div>

            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={() => setIsModalOpen(true)}
              className="group bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Income
            </motion.button>
          </div>
        </header>

        {/* --- SMART INSIGHTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-emerald-400" size={20} />
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Earned</p>
            </div>
            <p className="text-3xl font-bold text-white">LKR {totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-cyan-400" size={20} />
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Top Source</p>
            </div>
            <p className="text-3xl font-bold text-white">{topCategory}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-blue-400" size={20} />
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Entries</p>
            </div>
            <p className="text-3xl font-bold text-white">{transactions.length} <span className="text-lg text-gray-500">records</span></p>
          </div>
        </div>

        {/* --- CONTROLS: SEARCH & TABS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex bg-black/50 border border-white/10 rounded-xl p-1.5 w-full md:w-auto">
            <button onClick={() => setActiveTab('all')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveTab('work')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'work' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Work</button>
            <button onClick={() => setActiveTab('allowance')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'allowance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Allowance</button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" placeholder="Search income..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* --- TRANSACTIONS LIST --- */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Syncing with database...</p>
            </div>
          ) : filteredIncome.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-gray-400 text-xl font-bold mb-2">No money found! 💸</p>
              <p className="text-gray-500">Adjust your search or add a new income source.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredIncome.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <p className="text-2xl font-bold text-emerald-400">+LKR {item.amount.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
                      {item.status} <ArrowUpRight size={12} />
                    </div>

                    {/* Edit & Delete Hover Actions */}
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
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT INCOME MODAL UI --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button onClick={handleCloseModal} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Wallet className="text-emerald-500" /> 
                {editingId ? 'Edit Income' : 'New Income'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Income Source</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Freelance Client, Allowance"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">LKR</span>
                      <input 
                        type="number" required min="1" step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Allowance">Allowance</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Income' : 'Save Income')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
