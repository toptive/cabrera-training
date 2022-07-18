import nextConnect from 'next-connect';
import getUserId from '../../../functions/getUserId';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const model = 'events';
const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const {
      query: { slug },
      method,
      body,
    } = req;
    const event = await models.events.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: event });
  })
  // Post method
  .post(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, description, dateInit, dateEnd } = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newEvent = {};

    try {
      newEvent = await models.events.create({
        title,
        description,
        dateInit,
        dateEnd,
        status: 1,
        userId: user.id,
      });
    } catch (err) {
      /* Sql error number */
      statusCode = 500;
      error = err.original.errno && 'Not available right now';
      status = 'error';
    }

    return res.status(statusCode).json({
      status,
      error,
      message: 'done',
      data: newEvent,
    });
  })
  // Delete method
  .delete(async (req, res) => {
    const { slug } = req.query;
    const userIdEvent = await getUserId(slug, model);
    const { user } = req;
    //Check if user = userId event
    if (userIdEvent !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can delete the event',
      });
    } else {
      const eventDeleted = await models.events.destroy({
        where: { id: slug }
      });
      return res.status(200).json({
        message: 'success',
        body: eventDeleted
      });
    }
  })
  // Put method
  .put(async (req, res) => {
    const { slug } = req.query;
    const user = req.user;
    const userIdEvent = await getUserId(slug, model)
    if (userIdEvent !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can edit the event',
      });
    } else {
      const eventEdit = await models.events.update(req.body, {
        where: { id: slug },
      });
      return res.status(200).json({
        message: 'success',
        body: eventEdit
      });
    }
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
