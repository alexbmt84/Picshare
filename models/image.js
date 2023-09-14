'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;

module.exports = (sequelize, DataTypes) => {

  class Image extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // Define associations here
      Image.belongsTo(models.User, { foreignKey: 'userId' });
      Image.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Image.hasMany(models.ImageScore, { foreignKey: 'imageId', as: 'scores' });
      Image.hasMany(models.Hashtag, { as: 'hashtags' });


    }
    
  };

  Image.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
      categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    modelName: 'Image',
    tableName: 'images'
  });

  // Inside Image model

  // Inside Image model

  Image.findAllWithRatings = async function () {

    try {

      const images = await this.findAll({
        include: [
          {
            model: sequelize.models.User,
            as: 'User',
            attributes: ['username', 'id'],
          },
          {
            model: sequelize.models.ImageScore,
            as: 'scores',
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('scores.id')), 'voteCount'], // Alias the ImageScore id column
              [sequelize.fn('AVG', sequelize.col('note')), 'average'],
            ],
          },
        ],
        group: ['Image.id', 'User.id'],
        order: [['createdAt', 'DESC']],
      });
  
      const imagesWithRatings = images.map((image) => {
        const stats = {
          voteCount: 0,
          average: 0,
        };
  
        if (image.scores.length > 0) {
          stats.voteCount = parseInt(image.scores[0].dataValues.voteCount);
          stats.average = parseFloat(image.scores[0].dataValues.average);
        }
  
        return {
          ...image.toJSON(),
          ...stats,
          username: image.User.username,
          idUser: image.User.id,
        };

      });
  
      return imagesWithRatings;

    } catch (error) {

      console.log(error);
      return [];

    }

  };
  
  return Image;

};
