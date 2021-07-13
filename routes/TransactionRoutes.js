import express from 'express';
import transactions from '../models/Transactions.js';
import histories from '../models/Histories.js';

const router = express.Router();


// Trade Stocks
router.post('/stocks/trade', (req, res) => {

transactions.findOne({ user_id: req.body.user_id }, async (err, stock) => {
		// If erro 
		if (err) throw err;
		
		// If stocks alredy exist update stocks
    if (stock) {
			transactions.findOneAndUpdate({user_id: req.body.user_id}, 
				{	
					stocks: req.body.stocks
				},
				async (err, data)=> {
					if(err) {
						res.status(500).send(err);
					}else {
						res.status(201).send('ok');
					}
			});
		}
		// If new stocks create stocks
    if (!stock) {
			const newTransactions = new transactions({
        user_id: req.body.user_id,
				stocks: req.body.stocks
      });
			await newTransactions.save();
			res.send('ok');
		}
	});
});


// Save transactions 
router.post('/stocks/save', (req, res) => {
	const newHistories = {
		user_id: req.body.user_id,
		symbol: req.body.symbol,
    shares: req.body.shares,
		price: req.body.price,
		time: req.body.time
	 };
	 histories.create(newHistories, (err, data) => {
		if(err) {
			res.status(500).send(err);
		}else {
			res.status(201).send(data);
		}
	 });
});


// Get transactions datas
router.post('/stocks/sync', (req, res) => {
	transactions.find({ user_id: req.body.user_id},
	(err, docs)=> {
		if(err) {
			res.status(500).send(err);
		}else {
			res.status(200).send(docs);
		}
	});
});


// Get Histories datas
router.post('/histories/sync', (req, res) => {
	histories.find({ user_id: req.body.user_id },
	(err, docs)=> {
		if(err) {
			res.status(500).send(err);
		}else {
			res.status(200).send(docs);
		}
	});
});


export default router;