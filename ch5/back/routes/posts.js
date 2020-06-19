const express = require('express');

const db = require('../models');

const router = express.Router();


router.get('/', async (req, res, next) => { // GET /posts?offsest=10&limit=10 이걸 req.qeury로 가져올수있음
    try {
        const posts = await db.Post.findAll({
            include: [{
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
            offset: parseInt(req.query.offset, 10) || 0,//실무에서는 중간에 글생겼을때 건너띄어지고 성능문제도 있고해서 offset limit방식 안쓴다
            limit: parseInt(req.query.limit, 10) || 10,
        });

        return res.json(posts);

    } catch (err) {
        console.log(err);
        next(err);
    }
})
module.exports = router;

