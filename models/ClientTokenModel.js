const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const Model = sequelize.define(
    'client_token',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: Sequelize.TEXT,
            primaryKey: false,
            allowNull: false
        },
        client_token: {
            type: Sequelize.TEXT,
            primaryKey: false,
            allowNull: false
        },
        public_token: {
            type: Sequelize.TEXT,
            primaryKey: false,
            allowNull: false
        },
    },
    {
        timestamps: false,
        freezeTableName: true // true = nama table asli , false = nama table ketambahan 's' diakhir
    }
    );
    
    module.exports = Model;