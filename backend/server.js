require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cron = require('node-cron');
const twilio = require('twilio'); // <-- Added Twilio
const connectDB = require('./database');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
// CRITICAL FOR TWILIO: This allows Express to read Twilio's incoming webhook data
app.use(express.urlencoded({ extended: true })); 

connectDB();

// --- MONGODB SCHEMAS ---
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String,
  status: String,
  dueDate: String,
  isRecurring: { type: Boolean, default: false },
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

// --- TRANSACTION ROUTES ---
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
      status: req.body.status,
      isRecurring: req.body.isRecurring || false
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

// --- STREAK CALCULATION ROUTE ---
app.get('/api/streak', async (req, res) => {
  try {
    const txs = await Transaction.find({ type: 'expense' }).select('date').sort({ date: -1 });
    if (txs.length === 0) return res.json({ streak: 0 });

    let currentStreak = 0;
    const now = new Date();
    const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay())).setHours(0,0,0,0);
    
    let expectedWeekStart = currentWeekStart;

    for (let i = 0; i < txs.length; i++) {
      const txDate = new Date(txs[i].date);
      const txWeekStart = new Date(txDate.setDate(txDate.getDate() - txDate.getDay())).setHours(0,0,0,0);

      if (txWeekStart === expectedWeekStart) {
        if (i === 0 || new Date(txs[i-1].date).setHours(0,0,0,0) !== txWeekStart) {
             currentStreak++;
             expectedWeekStart = new Date(expectedWeekStart - 7 * 24 * 60 * 60 * 1000).setHours(0,0,0,0);
        }
      } else if (txWeekStart < expectedWeekStart) {
        break; 
      }
    }
    res.json({ streak: currentStreak });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- SAVINGS ROUTES ---
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

// --- SPLIT BILL ROUTES ---
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

// --- AI ADVISOR ROUTE ---
app.post('/api/advisor', async (req, res) => {
  const { amount } = req.body;
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "API Key missing" });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const prompt = `Act as an expert financial advisor in Sri Lanka. A university student has a surplus of LKR ${amount}. 
    Provide exactly 3 diverse investment options available ONLY in Sri Lanka. Return valid JSON only.`;
    
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const cleanedJson = textResponse.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanedJson));
  } catch (error) { 
    res.status(500).json({ error: "AI Failed" }); 
  }
});

// --- CRON JOB: RECURRING EXPENSES ---
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  if (today.getDate() === 1) {
    try {
      const recurringTxs = await Transaction.aggregate([
        { $match: { isRecurring: true } },
        { $sort: { date: -1 } },
        { $group: { _id: "$title", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } }
      ]);

      for (const tx of recurringTxs) {
        const dueDate = new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0];
        await Transaction.create({
          title: tx.title, amount: tx.amount, type: tx.type, category: tx.category,
          status: `pending|${dueDate}`, isRecurring: true, date: new Date()
        });
      }
    } catch (error) { console.error('❌ Error:', error); }
  }
});

// --- 🟢 WHATSAPP BOT LOGIC (TWILIO WEBHOOK) ---
const { MessagingResponse } = twilio.twiml;

app.post('/api/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body || '';
  const twiml = new MessagingResponse();

  // Regex to match "Word Number" format (e.g., "Lunch 1500")
  const match = incomingMsg.match(/(.+)\s+(\d+)$/);

  if (match) {
    const title = match[1].trim();
    const amount = parseInt(match[2], 10);

    try {
      await Transaction.create({
        title: title,
        amount: amount,
        type: 'expense',
        category: 'Other', 
        status: 'completed',
        date: new Date()
      });

      twiml.message(`✅ Logged: LKR ${amount.toLocaleString()} for ${title}!`);
    } catch (error) {
      console.error(error);
      twiml.message(`❌ Error saving expense.`);
    }
  } else {
    twiml.message("👋 Welcome to StudentOS Finance!\n\nTo log an expense via WhatsApp, simply reply with the Item and Amount.\n\n*Example:* Uber 500");
  }

  // Send the XML response back to Twilio
  res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));