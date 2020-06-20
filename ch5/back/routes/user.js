const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');


router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (err) {
        console.log(err);
        next(err);
    }
})
router.post('/', isNotLoggedIn, async (req, res, next) => {
    try{
        const exUser = await db.User.findOne(({
            where:{
                email: req.body.email
            }
        }));
        if(exUser){
           return res.status(403).json({
               errorCode: 1,
               message: '이미 가입된 아이디입니다.'
           });
        }
        const hash = await bcrypt.hash(req.body.password, 12);
        const user = await db.User.create({
                email: req.body.email,
                password: hash,
                nickname: req.body.nickname
        });

        return res.json(user);
        //자동로그인 부분 잠깐 지워두자 이상해
        //HTTP status 코드 검색해서 여러상태코드 알아두기
        // passport.authenticate('local', (err, user, info) => { // 회원가입후 바로 로그인
        //     if(err){
        //         console.error(err);
        //         return next(err);
        //     }
        //     if(info){
        //         return res.status(401).json({
        //             errorCode: 13141,
        //             message: info.reason
        //         });
        //     }
        //     return req.login(user, async (err) => { //세션에 사용자 정보 저장 어떻게 저장?? - serializeUser
        //         if(err){
        //             console.error(err);
        //             return next(err);
        //         }
        //         return res.json(user);
        //     });
        // })(req, res, next);

    }catch(err){
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => { 
    passport.authenticate('local', (err, user, info) => {   
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(401).json({
                errorCode: info.errorCode,
                message: info.reason
            });
        }
        return req.login(user, async (err) => { //세션에 사용자 정보 저장 어떻게 저장?? - serializeUser
            if(err){
                console.error(err);
                return next(err);
            }
            const fullUser = await db.User.findOne({
                where: {
                    id: user.id,
                },
                attributes: ['id','nickname'],
                include: [{
                    model: db.Post,
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id']
                }, {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id']
                }],
            });   
            return res.json(fullUser);
        });
    })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
    if(req.isAuthenticated){
        req.logout();
        req.session.destroy(); //이부분은 선택사항
        return res.status(200).send('로그아웃 되었습니다.');
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        });
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch('/nickname/', isLoggedIn, async (req, res, next) => {
    try {
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        });
        res.send(req.body.nickname);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
      const user = await db.User.findOne({
        where: { id: req.user.id },
      });
      const followings = await user.getFollowings({
        attributes: ['id', 'nickname'],
        limit: parseInt(req.query.limit || 3, 10),
        offset: parseInt(req.query.offset || 0, 10),
      });
      res.json(followings);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
      const user = await db.User.findOne({
        where: { id: req.user.id },
      });
      const followers = await user.getFollowers({
        attributes: ['id', 'nickname'],
        limit: parseInt(req.query.limit || 3, 10),
        offset: parseInt(req.query.offset || 0, 10),
      });
      res.json(followers);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });



module.exports = router;