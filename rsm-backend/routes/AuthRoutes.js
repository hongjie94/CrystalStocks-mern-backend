import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

// App Config
const router = express.Router();


router.get('/google',
	passport.authenticate('google', { scope: [ 'email', 'profile'] }));
		
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', session: true }),
  (req, res) =>{
    res.redirect('http://localhost:3000');
});

router.get("/logout", (req, res) => {
	req.logout();
	res.send("done");
});


router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});

router.get("/getuser", (req, res) => {
	res.send(req.user);
});


export default router;