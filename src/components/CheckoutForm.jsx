import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserContext from "../hooks/useUserContext";
import Swal from "sweetalert2";

const CheckoutForm = ({amount}) => {
  const {user, setUserRole} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const options = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    }
  };

  useEffect(() => {
    axiosSecure.post('/create-payment-intent', {amount: amount})
      .then(res => {
        setClientSecret(res.data?.clientSecret);
      })
  }, [amount, axiosSecure]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    await stripe.createPaymentMethod({
      type: 'card',
      card: card
    });

    const {paymentIntent, error} = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.displayName,
          email: user?.email
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    } else setErrorMsg('');

    if (paymentIntent.status === 'succeeded') {
      axiosSecure.put('/updateUserRole', {role: 'gold'})
        .then(res => {
          if (res.data.modifiedCount > 0) {
            setUserRole('gold');
            Swal.fire(
              'Congrats!',
              'You earned a gold badge!',
              'success'
            );
            e.target.reset();
          }
        })
    } else {
      Swal.fire(
        'Error!',
        'Payment unsuccessful!',
        'error'
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-2 border-gray-300 px-4 py-3 rounded-lg bg-white">
        <CardElement options={options} />
      </div>
      {
        errorMsg && <p className="font-medium text-red-600 mt-4 text-left">{errorMsg}</p>
      }
      <button type="submit" className="btn btn-primary mt-4" disabled={!stripe || !elements || !clientSecret}>Pay</button>
    </form>
  );
};

export default CheckoutForm;

CheckoutForm.propTypes = {
  amount: PropTypes.number
}