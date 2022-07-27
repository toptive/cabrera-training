'use strict';
module.exports = (sequelize, DataTypes) => {
    const transactions = sequelize.define(
        'transactions',
        {
            userId: DataTypes.INTEGER,
            balance: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
        },
    );
    transactions.associate = function (models) {
        //associations can be defined here
        transactions.belongsTo(models.users, { as: 'user' });
    };
    return transactions;
};