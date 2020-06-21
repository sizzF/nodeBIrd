const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');

router.get('/:tag', async (req, res, next) => {
    try {
        let where = {
            RetweetId: null,
        };
        if(parseInt(req.query.lastId, 10)) {
            where = {
                RetweetId: null,
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), //less than
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
              model: db.Hashtag,
              where: { name: decodeURIComponent(req.params.tag) },
            }, {
              model: db.User,
              attributes: ['id', 'nickname'],
            }, {
              model: db.Image,
            }, {
              model: db.User,
              as: 'Likers',
              attributes: ['id'],
            }, {
              model: db.Post,
              as: 'Retweet',
              include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
              }, {
                model: db.Image,
              }],
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10) || 10,
        });

        return res.json(posts);

    } catch (err) {
        console.log(err);
        next(err);
    }
});


module.exports = router;