const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');


module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => {
        try{
            const exUser = await db.User.findOne({ where: { email } });
            if(!exUser){
                return done(null, false, {
                    errorCode: 10,
                    reason: '존재하지 않는 사용자 입니다.'
                });
            }
            const result = await bcrypt.compare(password, exUser.password);
            if(result){
                return done(null, exUser);
            }else{
                return done(null, false, {
                    errorCode: 11,
                    reason: '비밀번호가 다릅니다.'
                });
            }
        }catch(err){
            console.error(err);
            return done(err);
        }
    }));
}