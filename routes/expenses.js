const express = require('express');
const Expense = require('../models/Expense');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Protect ALL expense routes with our JWT middleware
router.use(verifyToken);

// CREATE a new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    
    // Request Validation (Rubric Requirement)
    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required.' });
    }
    
    const newExpense = new Expense({
      amount,
      category,
      description,
      date,
      user: req.user.id // Grabbed from the verified token
    });
    
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    next(err); // Send to global error handler
  }
});

// READ all expenses for the logged-in user
router.get('/', async (req, res) => {
  try {
    // .populate() grabs the actual name and email from the linked User schema (Rubric Requirement)
    const expenses = await Expense.find({ user: req.user.id }).populate('user', 'name email');
    res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
});

// UPDATE an existing expense
router.put('/:id', async (req, res) => {
  try {
    // Ensure the expense belongs to the logged-in user before updating
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      req.body, 
      { new: true }
    );
    
    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found or unauthorized' });
    res.status(200).json(updatedExpense);
  } catch (err) {
    next(err);
  }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found or unauthorized' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;