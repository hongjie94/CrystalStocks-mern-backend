import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
    googleid: {
      type: String,
      required: false,
      unique: true
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false,
      unique: true
    },
    profilePicture: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    cash: {
      type: Number,
      default: 10000
    },
    watchlist: Array
})

export default mongoose.model('User', UsersSchema);