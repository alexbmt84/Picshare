'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Hashtag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Image, { foreignKey: 'imageId' });
        }
    }

    Hashtag.init({
    hashtag:{
        allowNull: false,
        type: DataTypes.INTEGER
    }, 
    imageId: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    createdAt: {
        allowNull: true,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
    }
    }, {
    sequelize,
    modelName: 'Hashtag',
    tableName: 'hashtags'
    });


    return Hashtag;

};