import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()

  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {})
  // Post method
  .post(async (req, res) => {})
  // Delete method
  .delete(async (req, res) => {})
  // Put method
  .put(async (req, res) => {
    const user = req.user;
      const updateBalance = await models.transactions.update(req.body, {
        where: { userId: user },
      });
      return res.status(200).json({
        message: 'success',
        body: updateBalance
      });
    
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
