const Transaction = require('../../models/transaction'); 


exports.getTransacation = (req,res)=>{
    res.render('addTransaction/transaction',{title: 'Add Transaction'});

}


exports.addTransaction = async (req, res) => {
  try {
    console.log('Received POST data:', req.body);

    const {
      paidBy,
      receivedBy,
      amount,
      transactionDate,
      repaymentDays,
      description
    } = req.body;

    const newTransaction = new Transaction({
      paidBy,
      receivedBy,
      amount: parseFloat(amount),
      transactionDate: new Date(transactionDate),
      repaymentDays: parseInt(repaymentDays),
      description
     
    });

    await newTransaction.save();

    res.redirect('/');
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).send('Error saving transaction.');
  }
};
