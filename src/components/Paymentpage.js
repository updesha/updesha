// React Component for Student Details and Payment
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // for making HTTP requests
import './Paymentpage.css'
const CoursePurchase = () => {
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    number: '',
    city: '',
    coursePrice: '',
    // add other fields as needed
  });

  const handleInputChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script has loaded.');
    };
    document.head.appendChild(script);
  }, []);
  
  const handlePayment = async () => {
    if (!studentDetails.name || !studentDetails.email || !studentDetails.number || !studentDetails.city) {
      alert('Please fill in all required fields.');
      return;
    }
    // Send student details to your server

    try {
      const response = await axios.post('http://localhost:3001/create-order', {amount: 200000, currency: 'INR', studentDetails});
      const orderId = response.data.orderId; // obtain order ID from your server

      // Initialize Razorpay
      const razorpay = new window.Razorpay({
        key_id: 'rzp_test_z57d56ey1eHhxo',
        order_id: orderId,
        amount: studentDetails.coursePrice*100, // example amount in paise (₹100)
        name: 'Your Course Name',
        description: 'Course Purchase',
        handler: function (response) {
          // handle successful payment
          // submit payment success and student details to your server
          axios.post('http://localhost:3001/payment-success', { response, studentDetails });
        },
        prefill: {
          name: studentDetails.name,
          email: studentDetails.email,
          // add other fields as needed
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Updesha</h2>
      <div className='form-back'>
      <form>
        <label htmlFor="name">Enter Your Name:</label>

        <input placeholder="Name" type="text" id = "name" name="name" value={studentDetails.name} onChange={handleInputChange} required />
        
        <label htmlFor="email">Your Email</label>

        <input type="email" id="email" placeholder="Email" name="email" value={studentDetails.email} onChange={handleInputChange} />
        <label htmlFor="number">Your Number</label>

        <input type="number" placeholder="123-45-678" id = "number" name="number" value={studentDetails.number} onChange={handleInputChange} />
        <label htmlFor="city">Your City</label>

        <input type="text" placeholder="City" id = "city" name="city" value={studentDetails.city} onChange={handleInputChange} />

        {/* Button to initiate payment */}
        <button type="button" onClick={handlePayment}>
          Buy Course
        </button>
      </form>
      </div>
      <div className='info'>
      <ul>
        <li>Customized Study Plans : Tailored strategies that align with your unique learning style, focusing on maximizing your strengths and improving your weaknesses.</li>
        <li>One-on-One Mentorship Sessions : Benefit from regular personalized sessions, ensuring that your doubts are addressed promptly and effectively.</li>
        <li>Top mentors : Get mentored by top rankers from Top IITs and learn from their strategies that will not only help you ace jee but in life too.</li>
        <li>Cheapest mentorship : As promised, we know the situation of families most of us are from. The aim is to provide the best under a reasonable rate.</li>
      </ul>
      </div>
    </div>
    
  );
};

export default CoursePurchase;
