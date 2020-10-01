const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const Model = sequelize.define(
    'other_data',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        parameter: {
            type: Sequelize.TEXT,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    },
    {
        timestamps: false, // true = ketambahan 2 kolom create_at & update_at (AUTO) klo false tidak ketambahan
        freezeTableName: true // true = nama table asli , false = nama table ketambahan 's' diakhir
    }
    );
    
    module.exports = Model;