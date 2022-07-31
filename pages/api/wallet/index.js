import nextConnect from 'next-connect';
const models = require('../../../db/models/index');
import middleware from '../../../middleware/auth';

const handler = nextConnect()
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const {
      query: { nextPage },
      method,
      body,
    } = req;

    const transactions = await models.transactions.findAndCountAll({
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
      attributes: {
        exclude: ['userId'],
      },
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['id', 'DESC'],
      ],
      offset: nextPage ? +nextPage : 0,
      limit: 5,
    });
    
    res.statusCode = 200;
    res.json({
      status: 'success',
      data: transactions.rows,
      total: transactions.count,
      nextPage: +nextPage + 5,
    });
  });

export default handler;
