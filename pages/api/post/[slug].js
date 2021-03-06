import nextConnect from 'next-connect';
import getUserId from '../../../functions/getUserId';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const model = 'posts';
const handler = nextConnect()


  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const { slug } = req.query;
    const post = await models.posts.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdAt', 'ASC'],
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: post });
  })
  // Post method
  .post(async (req, res) => {
    const { body } = req;
    const { title, content } = body;
    const { user } = req;
    const newPost = await models.posts.create({
      title,
      content,
      status: 1,
      userId: user.id,
    });
    return res.status(200).json({
      status: 'success',
      message: 'done',
      data: newPost,
    });
  })
  // Delete method
  .delete(async (req, res) => {
    const { slug } = req.query;
    const userIdPost = await getUserId(slug, model);
    const { user } = req;
    //Check if user = userId post
    if (userIdPost !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can delete the post',
      });
    } else {
      const postDeleted = await models.posts.destroy({
        where: { id: slug }
      });
      return res.status(200).json({
        message: 'success',
        body: postDeleted
      });
    }
  })
  // Put method
  .put(async (req, res) => {
    const { slug } = req.query;
    const user = req.user;
    const userIdPost = await getUserId(slug, model)
    if (userIdPost !== user.id) {
      return res.status(400).json({
        status: 'error',
        error: 'Only the user can edit the post',
      });
    } else {
      const postEdit = await models.posts.update(req.body, {
        where: { id: slug },
      });
      return res.status(200).json({
        message: 'success',
        body: postEdit
      });
    }
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
