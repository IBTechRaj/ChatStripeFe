import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [cardnumber, setCardnumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');

    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [cvv, setCvv] = useState('');
    const [expiry, setExpiry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
        });

        if (error) {
            setError(error.message);
        } else {
            const response = await fetch('http://localhost:3001/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseInt(amount) * 100, // Convert to cents
                    payment_method_id: paymentMethod.id,
                    email: email,
                    name: name,
                    address_line1: addressLine1,  // Customer's address line 1
                    address_city: city,  // Customer's city
                    address_state: state,  // Customer's state
                    address_postal_code: postalCode,  // Customer's postal code
                    address_country: 'IN',  // Customer's country (India in this case)
                }),
            });

            const paymentResult = await response.json();
            if (paymentResult.success) {
                setPaymentSuccess(true);
            } else {
                setError(paymentResult.error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={inputStyle}
            /><input
                type="number"
                placeholder="Card number"
                value={cardnumber}
                onChange={(e) => setCardnumber(e.target.value)}
                required
                style={inputStyle}
            /> <input
                type="number"
                placeholder="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="number"
                placeholder="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="Address line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="number"
                placeholder="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                style={inputStyle}
            />

            <label style={labelStyle}>Card Number</label>
            <div style={stripeElementContainer}>
                <CardNumberElement options={ELEMENT_OPTIONS} />
            </div>

            <label style={labelStyle}>Expiration Date</label>
            <div style={stripeElementContainer}>
                <CardExpiryElement options={ELEMENT_OPTIONS} />
            </div>

            <label style={labelStyle}>CVC</label>
            <div style={stripeElementContainer}>
                <CardCvcElement options={ELEMENT_OPTIONS} />
            </div>

            <button type="submit" disabled={!stripe} style={buttonStyle}>Pay</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {paymentSuccess && <p>Payment Successful!</p>}
        </form>
    );
};

export default PaymentForm;

// Inline CSS styles
const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
};

const labelStyle = {
    display: 'block',
    marginTop: '10px',
    marginBottom: '5px',
    fontWeight: 'bold',
};

const stripeElementContainer = {
    marginBottom: '10px',
    padding: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6772e5',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};
