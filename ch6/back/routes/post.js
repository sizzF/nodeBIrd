const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});


const upload = multer({ //이미지 form데이터 해석후에 uploads폴더에 알아서 저장
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'vue-nodebird-sizzf',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}${path.basename(file.originalname)}`)
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
    res.json(req.files.map(v => v.location));
});

router.post('/', isLoggedIn, async(req, res, next) => {
    try {

        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            UserId: req.user.id,
            content: req.body.content,
        })

        if (hashtags) {
            console.log(hashtags);
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }));
            } else {
                await db.Image.create({ src: image, PostId: newPost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Image,
            }],
        });
        return res.json(fullPost);
    } catch (err) {
        console.error(err);
        next(err)
    }
});
router.patch('/', isLoggedIn, async(req, res, next) => {
    try {

        const hashtags = req.body.content.match(/#[^\s#]+/g);

        const updatePost = await db.Post.findOne({
            where: { id: req.body.postId },
        });
        console.log(updatePost.UserId, req.user.id);
        if (updatePost.UserId !== req.user.id) {
            return res.status(404).send('회원님이 작성하신 글이 아닙니다.');
        }
        updatePost.update({
            UserId: req.user.id,
            content: req.body.content,
        })

        if (hashtags) {
            console.log(hashtags);
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            })));
            await updatePost.addHashtags(result.map(r => r[0]));
        }
        const images = await db.Image.destroy({ where: { postId: updatePost.id } });
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: updatePost.id });
                }));
            } else {
                await db.Image.create({ src: image, PostId: updatePost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: updatePost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Image,
            }],
        });
        return res.json(fullPost);
    } catch (err) {
        console.error(err);
        next(err)
    }
});
router.get('/:id', async(req, res, next) => { 
    try {
        const post = await db.Post.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Image,
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
        });
        console.log(post);
        res.json(post);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/:id', isLoggedIn, async(req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id
            }
        })
        if (post.UserId !== req.user.id) {
            return res.status(404).send('회원님이 작성하신 글이 아닙니다.');
        }
        post.destroy();
        
        res.send('삭제했습니다.');
    } catch (err) {
        console.log(err);
        next(err);
    }
});
router.get('/:id/comments', async(req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
            order: [
                    ['createdAt', 'ASC'],
                    ['updatedAt', 'DESC']
                ] //정렬 생성시간으로 ASC오름차순 DESC내림차순, 이차원 배열인 이유는 2번째 3번째 정렬옵션이 들어갈수 있어서
        });
        return res.json(comments);
    } catch (err) {
        console.log(err);
        next(err);
    }
});
router.post('/:id/comment', isLoggedIn, async(req, res, next) => { //POST /post/id/comment id가 params req.params.id
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        const comment = await db.Comment.findOne({ //db에 댓글저장후 저장한 댓글 정보+해당 유저정보 합쳐서 보내줌
            where: {
                id: newComment.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post('/:id/retweet', isLoggedIn, async(req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.Post,
                as: 'Retweet' //이미 리트윗한 게시글이면 원본 게시글이 됨
            }],
        });
        if (!post) {
            return res.status(404).send('포스트이 존재하지 않습니다.');
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) { //자기가 자기글 리트윗 하거나 이미 한번 리트윗된거의 작성자가 나인경우 제외
            return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({ //이미 내가 리트윗한 글인경우
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            }
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗했습니다.');
        }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            content: 'retweet',
            RetweetId: retweetTargetId
        });
        const retweetWithPrevPost = await db.Post.findOne({
            where: { id: retweet.id }, //방금생성한 글 찾고
            include: [{ //글쓴사람 누군지 찾고
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, { // 원본글 찾고
                model: db.Post,
                as: 'Retweet',
                include: [{ // 원본글 쓴사람 찾고
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image, // 원본글은 이미지까지
                }],
            }],
        });
        return res.json(retweetWithPrevPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.post('/:id/like', isLoggedIn, async(req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!post) {
            return res.status(404).send('게시글이 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        res.json({ userId: req.user.id })
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.delete('/:id/like', isLoggedIn, async(req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!post) {
            return res.status(404).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        res.json({ userId: req.user.id })
    } catch (err) {
        console.error(err);
        next(err);
    }
});
module.exports = router;