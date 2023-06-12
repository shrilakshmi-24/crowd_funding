const express = require('express');
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: 'rzp_test_ExKNBZ6BYAyY0y',
  key_secret: 'ww2MAFH6sOosIMhJgn5Jo2Vg',
});
const app = express();

app.use(express.json());

// Add your routes here
app.post('/create-order', async (req, res) => {
    const amount = req.body.amount;
    const currency = 'INR'; 
  
    const options = {
      amount,
      currency,
      receipt: 'order_receipt',
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the order' });
    }
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
