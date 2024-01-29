const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' https://checkout.razorpay.com; object-src 'self'");
  next();
});

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB connection URI)
mongoose.connect('mongodb+srv://hrushikesh280904:323sMqbUOCKRVmVa@cluster0.yjbjdxy.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a MongoDB schema and model for successful payments
const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  amount: Number,
  studentDetails: {
    name: String,
    email: String,
    number: String,
    city: String,
    coursePrice: String,

    // add other fields as needed
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

// Initialize Razorpay (replace 'your-razorpay-key-id' and 'your-razorpay-key-secret' with your actual Razorpay API keys)
const razorpay = new Razorpay({
  key_id: 'rzp_test_tmHLf19MlEbnIJ',
  key_secret: 'VRweQsiJ6LdSDdBIPDV7iE9E'
});
// Endpoint to create a Razorpay order
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    res.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle successful payments
app.post('/payment-success', async (req, res) => {
  const { order_id, payment_id, studentDetails } = req.body;

  // Validate payment response if needed

  // Save the payment details to MongoDB
  const newPayment = new Payment({
    orderId: order_id,
    paymentId: payment_id,
    amount: 200000,
    studentDetails,
  });

  try {
    await newPayment.save();
    res.status(200).send('Payment successful and data stored.');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
