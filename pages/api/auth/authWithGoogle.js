import models from '../../../db/models/index';
import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';

const KEY = process.env.JWT_KEY;

const handler = nextConnect()
    .get((req, res) => { })
    .post(async (req, res) => {
        /* Get Post Data */
        const { firstName, lastName, email, googleId } = req.body;
        /* Check user in database */
        const user = await models.users.findOne({
            where: { googleId: googleId },
            attributes: ['id', 'email'],
            limit: 1,
        });
        /* Check if exists */
        if (!user) {
            user = await models.users.create({
                email, firstName, lastName, googleId,
                username: firstName + lastName,
                password: (Math.floor(Math.random) * (77777777 - 100000000) + 100000000).toString(),
                status: 1
            });
        }

        /* Define variables */
        const dataUser = user.toJSON();
        const userId = dataUser.id,
            userEmail = dataUser.email;
        userPassword = dataUser.password;

        res.status(200).json({
            success: true,
            //token: 'Bearer ' + token,
        });

        // /* Create JWT Payload */
        // const payload = {
        //     id: userId,
        //     email: userEmail,
        // };
        // /* Sign token */
        // jwt.sign(
        //     payload,
        //     KEY,
        //     {
        //         expiresIn: 31556926, // 1 year in seconds
        //     },
        //     (err, token) => {
        //         res.status(200).json({
        //             success: true,
        //             token: 'Bearer ' + token,
        //         });
        //         console.log(err);
        //     },
        // );
    });
export default handler;
