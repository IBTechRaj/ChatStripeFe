import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

const App = () => (

  <Elements stripe={stripePromise}>
    {console.log('k', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)}

    {console.log('M', `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`)}
    <PaymentForm />
  </Elements>
);

export default App;

