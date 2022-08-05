import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51LPzykKGk6FuEVPskx85EdzUmahSrCXu7F21yDZEQYlkLZ6akfq76K9u8Veyk1rUgc5ZsPj3hT2T4yshnU3xFJPn00ZuebwzFS");

const CheckoutForm = (props) => {

    const { amount } = props;

    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(amount); return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });
        setLoading(true);

        if (!error) {
            // console.log(paymentMethod)
            const { id } = paymentMethod;
            try {
                const { data } = await axios.post(
                    "http://localhost:3001/api/checkout",
                    {
                        id,
                        amount, //cents
                    }
                );
                console.log(data);

                elements.getElement(CardElement).clear();
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
    };


    return (
        <form className="form-post" onSubmit={handleSubmit}>
            {/* User Card Input */}
            <div className="card-credit">
                <CardElement />
                <hr />
                <br />
            </div>

            <button disabled={!stripe} className="btn btn-block btn-warning">
                {loading ? (
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    "Charge"
                )}
            </button>
        </form>
    );
};

function AddBalance(props) {
    //const { amount } = props;
    //console.log(props.amount);
    return (
        <Elements stripe={stripePromise}>
            <div className="card">
                <div className="row h-100">
                    <div className="col-md-4 offset-md-4 h-100">
                        <CheckoutForm amount={props.amount} />
                    </div>
                </div>
            </div>
        </Elements>
    );
}

export default AddBalance;
