// models/ImageScore.js
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImageScore extends Model {

    // Define association here
    static associate(models) {
      // ImageScore belongs to Score
      this.belongsTo(models.Score, { 
        foreignKey: 'scoreId', 
        as: 'score'
      });
      // ImageScore belongs to Image
      this.belongsTo(models.Image, { 
        foreignKey: 'imageId',
        as: 'image'
      });
      
      // ImageScore belongs to Image
      this.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };

  ImageScore.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scoreId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'ImageScore',
    tableName: 'image_scores',
    timestamps: true
  });

  ImageScore.average = function(imageId) {

    return this.findAll({
      where: {
        imageId: imageId
      }
    })

    .then(scores => {
      if (scores.length === 0) return 0;
      const sum = scores.reduce((acc, score) => acc + score.note, 0);
      return sum / scores.length;
    });

  };

  ImageScore.countVotes = async function (imageId) {

    try {

      const result = await this.findAll({
        where: { imageId: imageId }
      });

      return result.length;

    } catch (error) {

      console.log(error);
      return 0;

    }

  };

  ImageScore.stats = async function(imageId) {

    return this.findAll({

      where: {
        imageId: imageId
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'voteCount'],
        [sequelize.fn('AVG', sequelize.col('note')), 'average']
      ],
      raw: true,

    })

    .then(result => {

      if(result[0].voteCount === 0) return { average: 0, voteCount: 0 };
      return { average: parseFloat(result[0].average), voteCount: parseInt(result[0].voteCount) };
    })

    .catch(err => {

      console.log(err);
      return { average: 0, voteCount: 0 };

    });

  };

  return ImageScore;

};

