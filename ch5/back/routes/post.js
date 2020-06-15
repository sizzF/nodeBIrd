const express = require('express');
const multer = require('multer');
const path = require('path');

const { isLoggedIn } = require('./middlewares');
const db = require('../models');
const { nextTick } = require('process');

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

        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }]
        });
        return res.json(fullPost);
    } catch (err) {
       console.error(err);
       next(err)
   }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) =>{
    res.json(req.files.map(v => v.filename));
});


module.exports = router;