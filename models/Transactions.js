import mongoose from 'mongoose';

const StockTransactionsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true
  },
  symbol: {
    type: String,
    unique: true
  },
  shares: Number,
  price: Number
}, {timestamps: true});

export default mongoose.model('transactions', StockTransactionsSchema);