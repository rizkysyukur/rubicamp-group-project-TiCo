'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    logdate: DataTypes.DATE,
    lognote: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Log.associate = function(models) {
    Log.belongsTo(models.User);
  };
  return Log;
};
