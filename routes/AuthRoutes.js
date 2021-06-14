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
    res.redirect('http://localhost:3000');
});

// Register user 
router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) throw err;
    if (user) res.send("User Already Exists");
    if (!user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log('username: ', req.body.username);
      console.log('email: ', req.body.email);
      console.log('password: ', hashedPassword);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
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
        res.redirect('http://localhost:4000/auth/getuser');
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
	res.send(req.user);
});


export default router;