const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  listingType: {
    type: DataTypes.ENUM('Teach', 'Learn'),
    allowNull: false,
  },
});

User.hasMany(Listing, { foreignKey: 'userId', onDelete: 'CASCADE' });
Listing.belongsTo(User, { foreignKey: 'userId' });

module.exports = Listing;
