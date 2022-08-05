import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = nextConnect()
    // Middleware
    .use(middleware)
    // Post method
    .post(async (req, res) => {
        const { body } = req;
        const { id, amount } = body;
        try {
            const payment = await stripe.paymentIntents.create({
                amount,
                currency: "USD",
                description: "Charge balance",
                payment_method: id,
                confirm: true, //confirm the payment at the same time
            });

            return res.status(200).json({ message: "Successful Payment" });
        } catch (error) {
            console.log(error);
            return res.json({ message: error.raw.message });
        }
    });
export default handler;