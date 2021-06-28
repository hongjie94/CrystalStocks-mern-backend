import express from 'express';
import transactions from '../models/Transactions.js';


const router = express.Router();


router.get('/', (req, res) => res.status(200).send('Hello World'));

router.post('/stock/buy', (req, res) => {
   const newTransactions = req.body;
	 transactions.create(newTransactions, (err, data) => {
		if(err) {
			res.status(500).send(err);
		}else {
			res.status(201).send(data);
		}
	 });
});

// router.get('/stock/new', (req, res) => {
// 	const newTransactions = req.body;

// 	const newStock = new Transactions({
// 		newTransactions: newTransactions
// 	});

// 	newStock.save()
// 		.then((result) => {
// 				res.send(result);
// 		})
// 		.catch((err) => {
// 				console.log(err);
// 		});
// });

router.get('/stock/sync', (req, res) => {
	transactions.find((err, data) => {
		if(err) {
			res.status(500).send(err);
		}else {
			res.status(200).send(data);
		}
	 });
});

router.post('/stock/sell', (req, res) => {
	const newShares = req.body.newShares;
	const newPrice = req.body.newPrice;
	const user_id = req.body.user_id;
	transCollection.findOneAndUpdate(
		{user_id: user_id}, 
		{shares: newShares, price:newPrice}).then((err, data)=> {
			if(err) {
				res.status(500).send(err);
			}else {
				res.status(200).send(data);
			}
		 });
    });
    
export default router;