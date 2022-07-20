const models = require('../db/models/index');

async function getUserId(slug, model) {
    let userID;
    if (model == 'posts') {
        userID = await models.posts.findAll({
            where: {
                id: slug,
            },
            attributes: ['userId'],
        })
    }
    if (model == 'jobs') {
        userID = await models.jobs.findAll({
            where: {
                id: slug,
            },
            attributes: ['userId'],
        })
    }
    if (model == 'events') {
        userID = await models.events.findAll({
            where: {
                id: slug,
            },
            attributes: ['userId'],
        })
    }
    const response = await userID;
    return response[0].dataValues.userId;
};

export default getUserId;