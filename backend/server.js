require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const connectDB = require('./database');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

// --- 🏗️ MONGODB SCHEMAS ---
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String,
  status: String,
  dueDate: String,
  date: { type: Date, default: Date.now }
}));

const Saving = mongoose.model('Saving', new mongoose.Schema({
  name: String,
  target: Number,
  current: { type: Number, default: 0 },
  color: String,
  deadline: String,
  date: { type: Date, default: Date.now }
}));

const Split = mongoose.model('Split', new mongoose.Schema({
  title: String,
  total_amount: Number,
  payer: String,
  members: Array, 
  date: { type: Date, default: Date.now }
}));


// --- 💰 TRANSACTION ROUTES ---
app.get('/api/transactions', async (req, res) => {
  try {
    const data = await Transaction.find().sort({ date: -1 });
    res.json(data.map(d => ({ ...d.toObject(), id: d._id })));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const newTx = await Transaction.create({
      title: req.body.title,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category || 'Misc',
      status: req.body.status
    });
    res.json({ ...newTx.toObject(), id: newTx._id });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const updatedTx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedTx.toObject(), id: updatedTx._id });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});


// --- 🎯 SAVINGS / WISHLIST ROUTES ---
app.get('/api/savings', async (req, res) => {
  try {
    const data = await Saving.find().sort({ date: -1 });
    res.json(data.map(d => ({ ...d.toObject(), id: d._id })));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/savings', async (req, res) => {
  try {
    const newSaving = await Saving.create({
      name: req.body.name,
      target: req.body.target,
      current: req.body.current || 0,
      color: req.body.color || '#a855f7',
      deadline: req.body.deadline
    });
    res.json({ success: true, id: newSaving._id });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/savings/:id', async (req, res) => {
  try {
    await Saving.findByIdAndUpdate(req.params.id, { $inc: { current: req.body.amountToAdd } });
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});


// --- 🍕 ADVANCED BILL SPLITTER ROUTES ---
app.get('/api/splits', async (req, res) => {
  try {
    const data = await Split.find().sort({ date: -1 });
    res.json(data.map(d => ({ ...d.toObject(), id: d._id })));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/splits', async (req, res) => {
  try {
    const newSplit = await Split.create({
      title: req.body.title,
      total_amount: req.body.total_amount,
      payer: req.body.payer,
      members: req.body.members
    });
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      for (const member of req.body.members) {
        if (member.email) {
          try {
            await transporter.sendMail({
              from: `"StudentOS Finance" <${process.env.EMAIL_USER}>`,
              to: member.email,
              subject: `💸 You owe LKR ${member.amount} for ${req.body.title}`,
              html: `
                <div style="font-family: Arial; padding: 20px; border-radius: 10px; background: #f3f4f6;">
                  <h2 style="color: #e11d48;">Split Bill Alert! 🚨</h2>
                  <p>Hi <b>${member.name}</b>,</p>
                  <p><b>${req.body.payer}</b> just paid <b>LKR ${req.body.total_amount}</b> for <b>${req.body.title}</b>.</p>
                  <h3 style="color: #be123c;">Your share to pay: LKR ${member.amount}</h3>
                </div>
              `
            });
          } catch(e) { console.error(`❌ Email failed for ${member.email}`); }
        }
      }
    }
    res.json({ success: true, id: newSplit._id });
  } catch (err) { res.status(400).json({ error: err.message }); }
});


// --- 🤖 AI ADVISOR ROUTE (3 OPTIONS SRI LANKA) ---
app.post('/api/advisor', async (req, res) => {
  const { amount } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API Key missing" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    // 👇 NEW: 3 Options Prompt (Low, Medium, High Risk) for Sri Lanka
    const prompt = `Act as an expert financial advisor in Sri Lanka. A university student has a surplus of LKR ${amount}. 
    Provide exactly 3 diverse investment options available ONLY in Sri Lanka:
    1. A Low-Risk option (e.g., CBSL Treasury Bills, or BOC/Commercial Bank Fixed Deposits).
    2. A Medium-Risk option (e.g., Corporate Debentures or Unit Trusts like CAL/First Capital).
    3. A High-Risk option (e.g., Blue-chip stocks on the Colombo Stock Exchange - CSE).
    
    Do NOT suggest foreign high-yield savings accounts, US Treasury bonds, IRAs, or 401ks.
    
    Return valid JSON only matching this exact structure: 
    {
      "options": [
        {
          "title": "Specific Sri Lankan Investment Name",
          "category": "Low Risk / Medium Risk / High Risk",
          "estimatedReturn": "Expected %",
          "explanation": "Short, punchy reason why this fits a student's portfolio."
        }
      ]
    }`;
    
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    const cleanedJson = textResponse.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanedJson));
    
  } catch (error) { 
    console.error("❌ Google AI Error Details:", error); 
    res.status(500).json({ error: "AI Failed" }); 
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));