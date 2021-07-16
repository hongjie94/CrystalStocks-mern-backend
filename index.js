// -------------------- importing --------------------
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import localStrategy from 'passport-local';
import AuthRoutes from './routes/AuthRoutes.js';
import TransactionRoutes from './routes/TransactionRoutes.js';
import User from './models/User.js';


// -------------------- App Config --------------------
const app = express();
dotenv.config();
// -------------------- Middleware --------------------
app.use(express.json());
app.use(cors({ origin: 'https://nifty-goldberg-c7ab73.netlify.app', credentials: true }));
app.set('trust proxy', 1); 
;
app.use(
	session({
		secret: "anything",
		resave: true,
		saveUninitialized: true,
		cookie: {
			sameSite: "none",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000, // One Day
		}
	})
);


// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// -------------------- Oauth --------------------

// Oauth with google strategy 
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, email, profile, done) =>{
	User.findOne({ googleid: profile.id }, async (err, user) => {
		if (err) {
			return done(err, null);
		}
		if(!user) {
			const newUser = new User({
				googleid: profile.id, 
				username: profile.displayName,
				email: profile._json.email,
				profilePicture: profile._json.picture
			});
			await newUser.save();
			done(null, newUser);
		}
		done(null, user);
	});
}));

// Oauth with local strategy
passport.use(
	new localStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) throw err;
			if (!user) return done(null, false);
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) throw err;
				if (result === true) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		});
	})
);

passport.serializeUser((user, done) => {
	return done(null, user._id);
});

passport.deserializeUser((id, done) => {
	console.log('deserializeUser')
	User.findById({_id: id}, (err, result) => {
		if(err) {
			console.log(err);
		} else {
			return done(null, result);
		}
	});
});


// -------------------- DB Config --------------------
mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true 
});

// const transCollection = mongoose.connection.collection("transactions");

mongoose.connection.once('open', () => {
	console.log("Connected to MongoDB!");
}).on('error', (error) => {
	console.log(`Connection error: ${error}`);
});


//-------------------- API Routes --------------------
app.get('/', (req, res) => { res.send("Hello World"); });
app.use('/api', TransactionRoutes);
app.use('/auth', AuthRoutes);


//-------------------- Listener --------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
});
