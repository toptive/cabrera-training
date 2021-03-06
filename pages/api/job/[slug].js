import nextConnect from 'next-connect';
import getUserId from '../../../functions/getUserId';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const model = 'jobs';
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
    const job = await models.jobs.findOne({
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
    return res.json({ status: 'success', data: job });
  })
  // Post method
  .post(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, content, emailTo, reportManager, dateLimit } = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newJob = {};

    try {
      newJob = await models.jobs.create({
        title,
        content,
        emailTo,
        reportManager,
        dateLimit,
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
      data: newJob,
    });
  })
  // Delete method
  .delete(async (req, res) => {
    const { slug } = req.query;
    const userIdJob = await getUserId(slug, model);
    const { user } = req;
    //Check if user = userId job
    if (userIdJob !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can delete the job',
      });
    } else {
      const jobDeleted = await models.jobs.destroy({
        where: { id: slug }
      });
      return res.status(200).json({
        message: 'success',
        body: jobDeleted
      });
    }
  })
  // Put method
  .put(async (req, res) => {
    const { slug } = req.query;
    const user = req.user;
    const userIdJob = await getUserId(slug, model)
    if (userIdJob !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can edit the job',
      });
    } else {
      const jobEdit = await models.jobs.update(req.body, {
        where: { id: slug },
      });
      return res.status(200).json({
        message: 'success',
        body: jobEdit
      });
    }
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
