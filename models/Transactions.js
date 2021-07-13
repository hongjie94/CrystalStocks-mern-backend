import mongoose from 'mongoose';

const StockTransactionsSchema = new mongoose.Schema({
  user_id: String,
  stocks: Array
});

export default mongoose.model('transactions', StockTransactionsSchema);