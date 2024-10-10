'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Spot, { foreignKey: 'spotId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.STRING,
    },   
    review: {
      type: DataTypes.STRING,
    },    
    stars: {
      type: DataTypes.INTEGER,
    },    
    // createdAt: {
    //   type: DataTypes.DATE,
    // },    
    // updatedAt: {
    //   type: DataTypes.DATE,
    // }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
