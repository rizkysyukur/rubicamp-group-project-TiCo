'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    pass: DataTypes.STRING,
    fbid: DataTypes.STRING,
    fbtoken: DataTypes.STRING,
    fbemail: DataTypes.STRING,
    fbname: DataTypes.STRING,
    twid: DataTypes.STRING,
    twtoken: DataTypes.STRING,
    twemail: DataTypes.STRING,
    twname: DataTypes.STRING,
    googleid: DataTypes.STRING,
    googletoken: DataTypes.STRING,
    googleemail: DataTypes.STRING,
    googlename: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Plan);
    User.hasMany(models.Log);
  };
  // hooks
  User.beforeCreate((user, options) => {
    let hashPasword = bcrypt.hashSync(user.pass, bcrypt.genSaltSync(8), null);
    user.pass =  hashPasword;
  });
  // instance Method
  User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.pass);
  };

  return User;
};
