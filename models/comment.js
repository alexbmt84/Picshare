'use strict';
const moment = require('moment');
require('moment/locale/fr'); // Import French local time
moment.locale('fr');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {

    static getCommentsWithUserData = async function (imageId) {

      try {

        const comments = await this.findAll({
          where: { imageId },
          include: {
            model: sequelize.models.User,
            attributes: ['username', 'avatar', 'id'],
          },
          raw: true, // Set raw: true to get plain JSON objects instead of Sequelize models
        });

        const commentData = comments.map((comment) => {

          const createdAt = moment.utc(comment.createdAt, 'YYYY-MM-DD HH:mm:ss.SSS Z').local().fromNow();

          return {
            username: comment['User.username'],
            avatar: comment['User.avatar'],
            userId: comment['User.id'],
            createdAt,
            comment: comment.comment,
            commentId: comment.id,
          };

        });

        return commentData;

      } catch {

      }

    };

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Image, { foreignKey: 'imageId' });
    }

  }
  
  Comment.init({
    comment:{
      allowNull: false,
      type: DataTypes.TEXT
    }, 
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    imageId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments'
  });
  
  return Comment;
};