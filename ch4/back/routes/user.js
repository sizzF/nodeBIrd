const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {

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
        await db.User.create({
                email: req.body.email,
                password: hash,
                nickname: req.body.nickname
        });
        //HTTP status 코드 검색해서 여러상태코드 알아두기
        passport.authenticate('local', (err, user, info) => {// 회원가입후 바로 로그인
            if(err){
                console.error(err);
                return next(err);
            }
            if(info){
                return res.status(401).json({
                    errorCode: 13141,
                    message: info.reason
                });
            }
            return req.login(user, async (err) => { //세션에 사용자 정보 저장 어떻게 저장?? - serializeUser
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.json(user);
            });
        })(req, res, next);

    }catch(err){
        console.error(err);
        return next(err);
    }
});

router.post('/login', async (req, res, next) => { 
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
            return res.json(user);
        });
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    if(req.isAuthenticated){
        req.logout();
        req.session.destroy(); //이부분은 선택사항
        return res.status(200).send('로그아웃 되었습니다.');
    }
})
module.exports = router;