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

// 1. Connect to MongoDB
connectDB();

// --- 🏗️ MONGODB SCHEMAS (Replacing SQLite Tables) ---

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
    // Map _id to id so the frontend doesn't break
    res.json(data.map(d => ({ ...d.toObject(), id: d._id })));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  try {
    let finalStatus = req.body.status;
    const newTx = await Transaction.create({
      title: req.body.title,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category || 'Misc',
      status: finalStatus
    });
    res.json({ ...newTx.toObject(), id: newTx._id });
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
    // $inc is a MongoDB superpower that does math automatically
    await Saving.findByIdAndUpdate(req.params.id, {
      $inc: { current: req.body.amountToAdd }
    });
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
    
    // 📧 AUTOMATIC EMAIL LOGIC
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
              subject: `💸 You owe $${member.amount} for ${req.body.title}`,
              html: `
                <div style="font-family: Arial; padding: 20px; border-radius: 10px; background: #f3f4f6;">
                  <h2 style="color: #e11d48;">Split Bill Alert! 🚨</h2>
                  <p>Hi <b>${member.name}</b>,</p>
                  <p><b>${req.body.payer}</b> just paid <b>$${req.body.total_amount}</b> for <b>${req.body.title}</b>.</p>
                  <h3 style="color: #be123c;">Your share to pay: $${member.amount}</h3>
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


// --- 🤖 AI ADVISOR ROUTE (UPGRADED) ---
app.post('/api/advisor', async (req, res) => {
  const { amount } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: API Key is missing from .env file!");
    return res.status(500).json({ error: "API Key missing" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Upgraded to the gemini-2.5-flash model for better financial advice quality
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const prompt = `Act as a financial advisor for a university student with a surplus of $${amount}. Return valid JSON only: { "recommendation": "Title", "explanation": "Reason", "riskLevel": "Low/Medium/High", "estimatedReturn": "Number" }`;
    
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Clean up the response to make sure it's perfect JSON
    const cleanedJson = textResponse.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanedJson));
    
  } catch (error) { 
    // This logs the exact error from Google to your terminal
    console.error("❌ Google AI Error Details:", error); 
    res.status(500).json({ error: "AI Failed" }); 
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));