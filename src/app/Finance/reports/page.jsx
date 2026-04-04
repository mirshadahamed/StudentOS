'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, Download, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';

// 👇 FIXED IMPORTS: We import autoTable as its own function now!
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { withUserQuery } from '../apiClient';

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

  // 5. Native PDF Export Logic (CRASH-PROOF & FIXED)
  const handleDownloadPDF = () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Add Title
      doc.setFontSize(22);
      doc.setTextColor(99, 102, 241);
      doc.text('Financial Analytics Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

      // Add Summary Data
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 14, 40);
      
      doc.setTextColor(16, 185, 129);
      doc.text(`Total Income: +$${totalIncome.toFixed(2)}`, 14, 48);
      
      doc.setTextColor(239, 68, 68);
      doc.text(`Total Expenses: -$${totalExpense.toFixed(2)}`, 14, 56);

      // Prepare Table Data
      const tableColumns = ["Date", "Description", "Category", "Type", "Amount"];
      const tableRows = transactions.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.title || item.description || 'N/A',
        item.category || 'Misc',
        item.type === 'income' ? 'INCOME' : 'EXPENSE',
        `$${item.amount.toFixed(2)}`
      ]);

      // 👇 FIXED: We call autoTable as a standalone function and pass 'doc' inside it
      autoTable(doc, {
        startY: 65,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Save the PDF
      doc.save(`StudentOS_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Generation Failed", error);
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
            {isExporting ? 'Generating PDF...' : <><Download size={20} /> Download PDF</>}
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <Tooltip cursor={{fill: '#262626'}} contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '10px' }} />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 text-center">Expense Breakdown</h3>
                {categoryData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">No expenses recorded yet.</div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '10px' }} />
                      </RechartsPie>
                    </ResponsiveContainer>
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
