import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  user_id: {
    type: String
  },
  symbol: {
    type: String
  },
  shares: {
    type: Number
  },
  price: {
    type: Number
  },
  time: {
    type: String
  }
});

export default mongoose.model('histories', HistorySchema);