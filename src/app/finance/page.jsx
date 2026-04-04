'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Trash2, Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';
import { financeAPI } from '@/lib/api';
import { getClientUserId } from '@/lib/auth';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const typeStyles = {
  income: { label: 'Income', color: '#34d399' },
  expense: { label: 'Expense', color: '#fb7185' },
  savings: { label: 'Savings', color: '#60a5fa' },
};

const emptySummary = { income: 0, expenses: 0, savings: 0, balance: 0, net: 0, count: 0 };

export default function FinancePage() {
  const [currentUserId, setCurrentUserId] = useState('guest-user');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [reports, setReports] = useState({ byCategory: [], byMonth: [], summary: emptySummary });
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const loadFinance = useCallback(async () => {
    setLoading(true);
    const [allTransactions, reportData] = await Promise.all([
      financeAPI.getTransactions(),
      financeAPI.getReports(),
    ]);
    setTransactions(allTransactions ?? []);
    setReports(reportData ?? { byCategory: [], byMonth: [], summary: emptySummary });
    setSummary(reportData?.summary ?? emptySummary);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCurrentUserId(getClientUserId());
    loadFinance();
  }, [loadFinance]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await financeAPI.createTransaction({
      ...form,
      amount: Number(form.amount),
      userId: getClientUserId(),
    });
    setForm({
      type: 'expense',
      amount: '',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    });
    await loadFinance();
    setSaving(false);
  };

  const removeTransaction = async (id) => {
    await financeAPI.deleteTransaction(id);
    await loadFinance();
  };

  const summaryCards = [
    { label: 'Income', value: summary.income, icon: TrendingUp, color: '#34d399' },
    { label: 'Expenses', value: summary.expenses, icon: TrendingDown, color: '#fb7185' },
    { label: 'Savings', value: summary.savings, icon: PiggyBank, color: '#60a5fa' },
    { label: 'Balance', value: summary.balance, icon: Wallet, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: '#080808', fontFamily: 'system-ui,sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 h-96 w-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#60a5fa,transparent)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#f97316,transparent)', filter: 'blur(90px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 transition-colors hover:text-neutral-300">
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Finance Hub</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Same-origin finance APIs under <code>/api/finance/*</code>, scoped by user ID.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/70">Active User</p>
            <p className="mt-1 text-sm font-semibold text-sky-100">{currentUserId}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-[1.75rem] border p-5"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${color}22` }}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">{label}</p>
                  <p className="mt-2 text-3xl font-black tracking-tight">{currency.format(value)}</p>
                </div>
                <div className="rounded-2xl p-3" style={{ background: `${color}14` }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <p className="text-xs text-neutral-500">Live from MongoDB transactions for the current user.</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <form
              onSubmit={submit}
              className="rounded-[2rem] border p-6"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(249,115,22,0.12)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400/70">New Transaction</p>
                  <h2 className="mt-2 text-xl font-black">Capture finance activity</h2>
                </div>
                {saving && <Loader2 size={18} className="animate-spin text-orange-400" />}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Type</span>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="savings">Savings</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Amount</span>
                  <input
                    value={form.amount}
                    onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                    placeholder="250.00"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Category</span>
                  <input
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                    placeholder="Scholarship, Rent, Food..."
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Date</span>
                  <input
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                    type="date"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Note</span>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                  placeholder="Optional note for reporting context"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}
              >
                {saving ? 'Saving...' : 'Add Transaction'}
              </button>
            </form>

            <div className="rounded-[2rem] border p-6" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(96,165,250,0.16)' }}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/70">Transactions</p>
                  <h2 className="mt-2 text-xl font-black">Recent activity</h2>
                </div>
                <p className="text-sm text-neutral-500">{transactions.length} records</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-sky-400" /></div>
              ) : transactions.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-500">No transactions yet for this user.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => {
                    const style = typeStyles[transaction.type];
                    return (
                      <div
                        key={transaction._id}
                        className="flex items-start justify-between gap-4 rounded-2xl border px-4 py-4"
                        style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${style.color}22` }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest" style={{ background: `${style.color}14`, color: style.color }}>
                              {style.label}
                            </span>
                            <p className="truncate text-sm font-semibold text-white">{transaction.category}</p>
                          </div>
                          <p className="text-xs text-neutral-500">
                            {new Date(transaction.date).toLocaleDateString('en-GB')} {transaction.note ? `• ${transaction.note}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black" style={{ color: style.color }}>
                            {currency.format(transaction.amount)}
                          </p>
                          <button
                            onClick={() => removeTransaction(transaction._id)}
                            className="rounded-xl border border-white/10 p-2 text-neutral-400 transition-colors hover:text-red-300"
                            aria-label="Delete transaction"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border p-6" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(52,211,153,0.16)' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/70">Report</p>
              <h2 className="mt-2 text-xl font-black">Top categories</h2>
              <div className="mt-5 space-y-3">
                {reports.byCategory?.slice(0, 6).map((item) => (
                  <div key={`${item.type}-${item.category}`} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.category}</p>
                      <p className="text-[11px] uppercase tracking-widest text-neutral-500">{item.type}</p>
                    </div>
                    <p className="text-sm font-black text-neutral-200">{currency.format(item.total)}</p>
                  </div>
                ))}
                {!reports.byCategory?.length && <p className="text-sm text-neutral-500">Report data will appear after the first transaction.</p>}
              </div>
            </div>

            <div className="rounded-[2rem] border p-6" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(245,158,11,0.16)' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">Monthly Trend</p>
              <h2 className="mt-2 text-xl font-black">Totals by month</h2>
              <div className="mt-5 space-y-3">
                {reports.byMonth?.map((item) => (
                  <div key={item.month} className="rounded-2xl border border-white/8 bg-white/2 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{item.month}</p>
                      <p className="text-xs text-neutral-500">Net {currency.format(item.income - item.expense)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-neutral-500">Income</p>
                        <p className="mt-1 font-black text-emerald-300">{currency.format(item.income)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Expense</p>
                        <p className="mt-1 font-black text-rose-300">{currency.format(item.expense)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Savings</p>
                        <p className="mt-1 font-black text-sky-300">{currency.format(item.savings)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {!reports.byMonth?.length && <p className="text-sm text-neutral-500">No monthly trend yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
