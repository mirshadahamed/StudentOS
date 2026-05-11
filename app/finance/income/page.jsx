'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Wallet,
  Plus,
  Calendar,
  ArrowUpRight,
  X,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

import MoneyRain from '@/components/MoneyRain';
import { withUserBody, withUserQuery } from '@/src/app/finance/apiClient';

export default function IncomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Work' });

  const fetchIncome = async () => {
    try {
      const response = await fetch(withUserQuery('/api/finance/transactions'));
      const data = await response.json();
      setTransactions(data.filter((transaction) => transaction.type === 'income'));
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', amount: '', category: 'Work' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: 'income',
      category: formData.category,
      status: 'received',
    };

    try {
      if (editingId) {
        await fetch(withUserQuery(`/api/finance/transactions/${editingId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withUserBody(payload)),
        });
      } else {
        await fetch('/api/finance/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withUserBody(payload)),
        });
      }

      await fetchIncome();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income) => {
    setEditingId(income.id);
    setFormData({
      title: income.title,
      amount: income.amount,
      category: income.category || 'Work',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this income record?')) return;

    try {
      await fetch(withUserQuery(`/api/finance/transactions/${id}`), { method: 'DELETE' });
      await fetchIncome();
    } catch (error) {
      console.error(error);
    }
  };

  const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categoryCounts = transactions.reduce((accumulator, transaction) => {
    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount;
    return accumulator;
  }, {});
  const topCategory =
    Object.keys(categoryCounts).length > 0
      ? Object.keys(categoryCounts).reduce((a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b))
      : 'None';

  const filteredIncome = transactions.filter((transaction) => {
    const matchesTab =
      activeTab === 'all' ||
      (transaction.category && transaction.category.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 p-8 font-sans text-white">
      <MoneyRain />
      <div className="pointer-events-none absolute right-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-10">
          <Link href="/finance" className="mb-6 inline-flex items-center gap-2 font-bold text-emerald-400 transition-colors hover:text-emerald-300">
            <ArrowLeft size={20} /> Back to Hub
          </Link>

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent"
              >
                Income Streams
              </motion.h1>
              <p className="mt-2 text-lg text-gray-400">Track your hustle, allowances, and wealth generation.</p>
            </div>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add Income
            </motion.button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-[40px]" />
            <div className="mb-2 flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={20} />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Total Earned</p>
            </div>
            <p className="text-3xl font-bold text-white">LKR {totalIncome.toLocaleString()}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[40px]" />
            <div className="mb-2 flex items-center gap-3">
              <Award className="text-cyan-400" size={20} />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Top Source</p>
            </div>
            <p className="text-3xl font-bold text-white">{topCategory}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px]" />
            <div className="mb-2 flex items-center gap-3">
              <Zap className="text-blue-400" size={20} />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Entries</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {transactions.length} <span className="text-lg text-gray-500">records</span>
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full rounded-xl border border-white/10 bg-black/50 p-1.5 md:w-auto">
            <button onClick={() => setActiveTab('all')} className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all md:px-6 ${activeTab === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveTab('work')} className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all md:px-6 ${activeTab === 'work' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Work</button>
            <button onClick={() => setActiveTab('allowance')} className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all md:px-6 ${activeTab === 'allowance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Allowance</button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search income..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm text-white transition-colors focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
              <p className="text-gray-500">Syncing with database...</p>
            </div>
          ) : filteredIncome.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
              <p className="mb-2 text-xl font-bold text-gray-400">No money found! 💸</p>
              <p className="text-gray-500">Adjust your search or add a new income source.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredIncome.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-emerald-500/50"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <p className="text-2xl font-bold text-emerald-400">+LKR {item.amount.toLocaleString()}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                      {item.status} <ArrowUpRight size={12} />
                    </div>
                    <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button onClick={() => handleEdit(item)} className="rounded-xl border border-white/5 bg-white/5 p-2 text-amber-500 shadow-sm transition-all hover:border-amber-500/30 hover:bg-amber-500/20">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-xl border border-white/5 bg-white/5 p-2 text-rose-500 shadow-sm transition-all hover:border-rose-500/30 hover:bg-rose-500/20">
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl"
            >
              <button onClick={handleCloseModal} className="absolute right-6 top-6 text-gray-400 transition-colors hover:text-white">
                <X size={24} />
              </button>

              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                <Wallet className="text-emerald-500" />
                {editingId ? 'Edit Income' : 'New Income'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-400">Income Source</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freelance Client, Allowance"
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-400">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">LKR</span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white transition-colors focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-400">Category</label>
                    <select
                      value={formData.category}
                      onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white transition-colors focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Allowance">Allowance</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Income' : 'Save Income'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
