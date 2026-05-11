'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, Download, Activity } from 'lucide-react';

import { withUserQuery } from '../apiClient';

const SimpleComparisonChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.amount), 1);

  return (
    <div className="flex h-full items-end gap-6 pt-4">
      {data.map((item) => (
        <div key={item.name} className="flex flex-1 flex-col items-center gap-3">
          <div className="text-sm font-bold text-white">${item.amount.toFixed(2)}</div>
          <div className="flex h-full w-full items-end rounded-t-3xl bg-white/[0.03] px-3">
            <div
              className="w-full rounded-t-3xl transition-all duration-700"
              style={{
                height: `${Math.max((item.amount / maxValue) * 100, 10)}%`,
                background: `linear-gradient(180deg, ${item.fill} 0%, rgba(255,255,255,0.08) 100%)`,
                boxShadow: `0 0 30px ${item.fill}33`,
              }}
            />
          </div>
          <div className="text-sm font-medium text-gray-400">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

const SimpleBreakdownChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let start = -90;

  const stops = data.map((item, index) => {
    const end = start + (item.value / total) * 360;
    const segment = `${colors[index % colors.length]} ${start}deg ${end}deg`;
    start = end;
    return segment;
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="relative h-52 w-52 rounded-full border border-white/10" style={{ background: `conic-gradient(${stops.join(', ')})` }}>
        <div className="absolute inset-[24%] flex items-center justify-center rounded-full border border-white/10 bg-neutral-900">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Expenses</p>
            <p className="text-lg font-bold text-white">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-sm text-gray-300">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">${item.value.toFixed(2)}</p>
              <p className="text-[11px] text-gray-500">{Math.round((item.value / total) * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(withUserQuery('/api/finance/transactions'));
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch reports data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const barChartData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#ef4444' },
  ];

  const categoryData = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((accumulator, transaction) => {
      const existing = accumulator.find((item) => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        accumulator.push({ name: transaction.category || 'Other', value: transaction.amount });
      }
      return accumulator;
    }, []);

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  const handleDownloadReport = () => {
    setIsExporting(true);

    try {
      const rows = [
        ['Generated On', new Date().toLocaleDateString()],
        ['Net Balance', netBalance.toFixed(2)],
        ['Total Income', totalIncome.toFixed(2)],
        ['Total Expenses', totalExpense.toFixed(2)],
        [],
        ['Date', 'Description', 'Category', 'Type', 'Amount'],
        ...transactions.map((item) => [
          new Date(item.date).toLocaleDateString(),
          item.title || item.description || 'N/A',
          item.category || 'Misc',
          item.type === 'income' ? 'INCOME' : 'EXPENSE',
          Number(item.amount || 0).toFixed(2),
        ]),
      ];

      const csv = rows
        .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `StudentOS_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV generation failed', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8 font-sans text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link href="/finance" className="mb-6 inline-flex items-center gap-2 font-bold text-indigo-400 transition-colors hover:text-indigo-300">
              <ArrowLeft size={20} /> Back to Hub
            </Link>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-indigo-500/20 p-4">
                <PieChart className="text-indigo-500" size={40} />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                  Financial Analytics
                </h1>
                <p className="mt-1 text-gray-400">Live data visualization & exports.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadReport}
            disabled={loading || isExporting}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold transition-all shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 disabled:opacity-50"
          >
            {isExporting ? 'Preparing export...' : <><Download size={20} /> Export CSV</>}
          </button>
        </header>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            <p className="text-gray-500">Compiling your data...</p>
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-950 p-4">
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">Net Balance</p>
                <p className={`text-4xl font-bold ${netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>${netBalance.toFixed(2)}</p>
              </div>

              <div className="rounded-3xl border border-emerald-500/30 bg-neutral-900 p-6">
                <div className="mb-2 flex items-start justify-between">
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-500">Total Income</p>
                  <TrendingUp className="text-emerald-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">+${totalIncome.toFixed(2)}</p>
              </div>

              <div className="rounded-3xl border border-red-500/30 bg-neutral-900 p-6">
                <div className="mb-2 flex items-start justify-between">
                  <p className="text-sm font-bold uppercase tracking-wider text-red-500">Total Expenses</p>
                  <TrendingDown className="text-red-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">-${totalExpense.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <h3 className="mb-6 text-center text-xl font-bold">Cash Flow Overview</h3>
                <div className="h-64">
                  <SimpleComparisonChart data={barChartData} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <h3 className="mb-6 text-center text-xl font-bold">Expense Breakdown</h3>
                {categoryData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-gray-500">No expenses recorded yet.</div>
                ) : (
                  <div className="h-64">
                    <SimpleBreakdownChart data={categoryData} colors={colors} />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                <Activity className="text-indigo-400" /> Transaction Log
              </h2>

              {transactions.length === 0 ? (
                <p className="py-8 text-center text-gray-500">No transactions found.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((item) => (
                    <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 p-4">
                      <div>
                        <p className="text-lg font-bold">{item.title || item.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()} • {item.category}
                        </p>
                      </div>
                      <div className={`text-xl font-bold ${item.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
