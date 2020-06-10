module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //테이블명은 posts
        content:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8mb4_general_ci'
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); //userId가 저장됨
        db.Post.hasMany(db.Commnet);
        db.Post.hasMany(db.Image);

    };

    return Post;
};