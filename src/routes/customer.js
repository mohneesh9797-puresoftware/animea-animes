// const express = require('express');
// const router = express.Router();
// const CustomerModel = require('../models/anime.model');

// // Create a new customer
// // POST localhost:3000/customer
// router.post('/customer', (req, res) => {
//   if (!req.body) {
//     return res.status(400).send('Request body is missing');
//   }

//   const model = new CustomerModel(req.body);
//   model.save()
//       .then((doc) => {
//         if (!doc || doc.length === 0) {
//           return res.status(500).send(doc);
//         }

//         res.status(201).send(doc);
//       })
//       .catch((err) => {
//         res.status(500).json(err);
//       });
// });

// // Gets a customer
// // GET localhost:3000/customer
// router.get('/customer', (req, res) => {
//   if (!req.query.email) {
//     return res.status(400).send('Missing URL parameter: email');
//   }

//   CustomerModel.findOne({
//     email: req.query.email,
//   })
//       .then((doc) => {
//         res.json(doc);
//       })
//       .catch((err) => {
//         res.status(500).json(err);
//       });
// });


// // Updates a customer
// // PUT localhost:3000/customer
// router.put('/customer', (req, res) => {
//   if (!req.query.email) {
//     return res.status(400).send('Missing URL parameter: email');
//   }

//   CustomerModel.findOneAndUpdate({
//     email: req.query.email,
//   }, req.body, {
//     new: true,
//   })
//       .then((doc) => {
//         res.json(doc);
//       })
//       .catch((err) => {
//         res.status(500).json(err);
//       });
// });

// // Deletes a customer
// // DELETE localhost:3000/customer
// router.delete('/customer', (req, res) => {
//   if (!req.query.email) {
//     return res.status(400).send('Missing URL parameter: email');
//   }

//   CustomerModel.findOneAndRemove({
//     email: req.query.email,
//   })
//       .then((doc) => {
//         res.json(doc);
//       })
//       .catch((err) => {
//         res.status(500).json(err);
//       });
// });

// module.exports = router;