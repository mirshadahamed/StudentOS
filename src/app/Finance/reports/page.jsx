'use client';

import React, { useState, useEffect } from 'react';
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
      <div
        className="relative h-52 w-52 rounded-full border border-white/10"
        style={{ background: `conic-gradient(${stops.join(', ')})` }}
      >
        <div className="absolute inset-[24%] flex items-center justify-center rounded-full bg-neutral-900 border border-white/10">
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

  // 1. Fetch Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(withUserQuery('/api/finance/transactions'));
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports data", error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // 2. Process Data for Totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // 3. Process Data for Bar Chart
  const barChartData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#ef4444' }
  ];

  // 4. Process Data for Pie Chart
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category || 'Other', value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  // 5. Offline-safe export as CSV instead of PDF
  const handleDownloadPDF = () => {
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
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `StudentOS_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV generation failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/finance" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6 font-bold">
              <ArrowLeft size={20} /> Back to Hub
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/20 rounded-2xl">
                <PieChart className="text-indigo-500" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Financial Analytics
                </h1>
                <p className="text-gray-400 mt-1">Live data visualization & exports.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownloadPDF}
            disabled={loading || isExporting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20"
          >
            {isExporting ? 'Preparing export...' : <><Download size={20} /> Export CSV</>}
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Compiling your data...</p>
          </div>
        ) : (
          <div className="p-4 bg-neutral-950 rounded-xl">
            
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-neutral-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Net Balance</p>
                <p className={`text-4xl font-bold ${netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                  ${netBalance.toFixed(2)}
                </p>
              </div>

              <div className="bg-neutral-900 border border-emerald-500/30 p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-emerald-500 text-sm font-bold uppercase tracking-wider">Total Income</p>
                  <TrendingUp className="text-emerald-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">+${totalIncome.toFixed(2)}</p>
              </div>

              <div className="bg-neutral-900 border border-red-500/30 p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-red-500 text-sm font-bold uppercase tracking-wider">Total Expenses</p>
                  <TrendingDown className="text-red-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">-${totalExpense.toFixed(2)}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 text-center">Cash Flow Overview</h3>
                <div className="h-64">
                  <SimpleComparisonChart data={barChartData} />
                </div>
              </div>

              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 text-center">Expense Breakdown</h3>
                {categoryData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">No expenses recorded yet.</div>
                ) : (
                  <div className="h-64">
                    <SimpleBreakdownChart data={categoryData} colors={COLORS} />
                  </div>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="text-indigo-400" /> Transaction Log
              </h2>
              
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions found.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((item) => (
                    <div key={item.id || item._id} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold text-lg">{item.title || item.description}</p>
                        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()} • {item.category}</p>
                      </div>
                      <div className={`font-bold text-xl ${item.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
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
