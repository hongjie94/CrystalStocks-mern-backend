import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// App Config
const router = express.Router();

// Login with Google
router.get('/google',
	passport.authenticate('google', { scope: [ 'email', 'profile'] }));
		
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', session: true }),
  (req, res) =>{
    res.redirect('http://localhost:3000/holdings');
});

// Register user 
router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) throw err;
    if (user) res.send("Username already exists.");
    if (!user) {

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: hashedPassword,
        googleid: req.body.username
      });
      await newUser.save();
      res.send("ok");
    }
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        const sendData = {
          id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
          email: user.email,
          cash: user.cash,
          watchlist: user.watchlist
        }
        res.send(sendData);
      });
    }
  })(req, res, next);
});

// Logout user
router.get("/logout", (req, res) => {
	req.logout();
	res.send("done");
});

// Get user data
router.get("/getuser", (req, res) => {
  if(req.user) {
    const sendData = {
      id: req.user._id,
      username: req.user.username,
      profilePicture: req.user.profilePicture,
      email: req.user.email,
      cash: req.user.cash,
      watchlist: req.user.watchlist
    }
    res.send(sendData);
  }	
});


export default router;