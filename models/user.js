'use strict';
const Sequelize = require('sequelize');
const Joi = require('joi');
const { Model } = Sequelize;
const { setAuthToken, getHashedPassword } = require('../helpers/auth');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {

      this.hasMany(models.Image, { foreignKey: 'userId' });

      User.belongsToMany(models.User, {
        as: 'followings',
        foreignKey: 'followerId',
        through: models.Follower,
      });
  
      User.belongsToMany(models.User, {
        as: 'followers',
        foreignKey: 'followingId',
        through: models.Follower,
      });
      
    }

    static async authenticate(email, rawPassword, res) {

      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','fr'] } }).required(),
        rawPassword: Joi.string().pattern(new RegExp('^[\\w\\W]{3,30}$')).required(),
      });

      const { error } = schema.validate({ email, rawPassword });

      if (error) {
        throw error.details[0].message;
      }

      const password = getHashedPassword(rawPassword);
      const result = await User.findOne({ where: { email , password }, attributes: ['id'] });

      if (result) {
        setAuthToken(result.id, res);
        return result;
      }
      else {
          throw 'Invalid email or password';
      }
    }

    static async new(userData) {

      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','fr'] } }).required(),
        username: 
          Joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .required(),
        password: Joi.string().pattern(new RegExp('^[\\w\\W]{3,30}$')).required(),
        confirmPassword: Joi.ref('password'),
      });

      const { email, username, password, confirmPassword } = userData;
      const { error } = schema.validate({ email, username, password, confirmPassword });

      if (error) {
        throw error.details[0].message;
      }

      if (password === confirmPassword) {
        const hashedPassword = getHashedPassword(password);

        return User.create({ email, username, password: hashedPassword })
      } 
      else {
        throw 'Passwords do not match.';
      }
    }

    static async getImagesWithUsername() {
      return Image.findAll({
        include: {
          model: User,
          attributes: ['username'],
        },
      });
    }

    static async changeAvatar(userId, avatarPath) {

      try {

        const user = await this.findOne({ where: { id: userId } });
    
        if (!user) {

          throw new Error('User not found');
        }
    
        user.avatar = avatarPath;
        await user.save();
        
      } catch (error) {

        // Gérez l'erreur comme vous le souhaitez, par exemple en la rejetant pour qu'elle puisse être gérée en aval
        throw error;

      }

    };
    
  };
  
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    password: {
      type: DataTypes.STRING(44),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },    
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
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
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};