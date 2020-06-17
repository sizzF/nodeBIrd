const express = require('express');
const multer = require('multer');
const path = require('path');

const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

const upload = multer({ //이미지 form데이터 해석후에 uploads폴더에 알아서 저장
    storage: multer.diskStorage({
        destination(req, file, done){ //어디다 저장할지
            done(null, 'uploads');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext); //승민.png basename=승민, ext=png
            done(null, basename + Date.now() + ext);
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) =>{
    res.json(req.files.map(v => v.filename));
});

router.post('/', isLoggedIn, async (req, res) => {
   try {
     
        const hashtags = req.body.content.match(/#[^\s#]+/g);

        const newPost = await db.Post.create({
           UserId: req.user.id,
           content: req.body.content,
        })

        if(hashtags){
            console.log(hashtags);
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        if(req.body.image){
            if(Array.isArray(req.body.image)){
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }));
            }else{
                await db.Image.create({ src: image, PostId: newPost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
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
router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            include:[{
                model: User.id,
                attributes: ['id', 'nickname'],
            }],
            order: [['createdAt', 'ASC']], //정렬 생성시간으로 ASC오름차순 DESC내림차순, 이차원 배열인 이유는 2번째 3번째 정렬옵션이 들어갈수 있어서
        });
        return res.json(comments);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.patch( '/:id', isLoggedIn, async (req, res ,next) => { //게시글 수정부분 구현, 부분수정 patch 전체수정 put
    try {
        
    } catch (err) {
        console.log(err);
        next(err);
    }
})
router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        await db.Post.detroy({
            where: {
                id: req.params.id
            }
        });
        res.send('삭제했습니다.');
    } catch (err) {
        console.log(err);
        next(err);
    }
})
router.post('/:id/comment', isLoggedIn, async (req, res, next) => { //POST /post/id/comment id가 params req.params.id
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        const comment = await db.Comment.findOne({//db에 댓글저장후 저장한 댓글 정보+해당 유저정보 합쳐서 보내줌
            where: {
                id: newComment.id,
            },
            include: [{
                model: User.id,
                attributes: ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
});


module.exports = router;