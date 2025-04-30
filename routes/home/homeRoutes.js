const express = require('express');
const { getTransacation, addTransaction } = require('../../controllers/transaction/controller');
const router = express.Router();
const Transaction = require('../../models/transaction'); 

// Utility function to get start of week for a given date (Monday)
function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  }
  
  router.get('/', async (req, res) => {
    try {
      const transactions = await Transaction.find();
      const today = new Date();
      const weeks = [];
      const repaymentCalendar = {}; // Format: { '2025-04-28': { friend: { youOwe, owesYou, transactions: [] } } }
  
      // Generate next 8 weeks from today
      for (let i = 0; i < 8; i++) {
        const startOfWeek = getWeekStartDate(new Date(today.getTime() + i * 7 * 24 * 60 * 60 * 1000));
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  
        const weekLabel = `Week ${i + 1}`;
        const rangeLabel = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  
        const weekStartStr = startOfWeek.toISOString().split('T')[0];
        repaymentCalendar[weekStartStr] = {};
  
        weeks.push({ label: weekLabel, range: rangeLabel, key: weekStartStr });
      }
  
      const currentUser = 'Dakshit Singh';
  
      // Organize transactions
      transactions.forEach(tx => {
        const repaymentWeekStart = getWeekStartDate(tx.repaymentDueDate);
        const key = repaymentWeekStart.toISOString().split('T')[0];
        if (!repaymentCalendar[key]) return;
  
        const friend = tx.paidBy === currentUser ? tx.receivedBy : tx.paidBy;
  
        if (!repaymentCalendar[key][friend]) {
          repaymentCalendar[key][friend] = { youOwe: 0, owesYou: 0, transactions: [] };
        }
  
        const type = tx.paidBy === currentUser ? 'owesYou' : 'youOwe';
        const entry = repaymentCalendar[key][friend];
  
        entry[type] += tx.amount;
  
        entry.transactions.push({
          _id: tx._id.toString(), // ✅ ADD THIS LINE
          amount: tx.amount,
          description: tx.description,
          status: tx.status,      // ✅ Optional if you want to check 'completed' in frontend
          type,
        });
      });
  
      res.render('home/home', {
        title: 'Home Page',
        weeks,
        repaymentCalendar,
        currentUser,
      });
  
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  router.post('/completeTransaction', async (req, res) => {
    const { transactionId } = req.body;
    try {
      // Update your DB accordingly, e.g.:
      await Transaction.updateOne({ _id: transactionId }, { status: 'completed' });
  
      res.status(200).send({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  });
module.exports = router;

module.exports = router;


module.exports = router;

router.get('/addtransaction',getTransacation);

router.post('/addtransaction',addTransaction);

