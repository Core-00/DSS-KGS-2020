const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const Model = sequelize.define(
    'sum_biner',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parameter: {
            type: Sequelize.TEXT,
            primaryKey: true,
            allowNull: false
        },
        sum: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        max_sum: Sequelize.VIRTUAL,
        sum_persen: Sequelize.VIRTUAL,
        sum_avg : Sequelize.VIRTUAL,
        sum_conclution : Sequelize.VIRTUAL,

        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },
    {
        timestamps: process.env.TIMESTAMPS, // true = ketambahan 2 kolom create_at & update_at (AUTO) klo false tidak ketambahan
        freezeTableName: true // true = nama table asli , false = nama table ketambahan 's' diakhir
    }
    );
    
    module.exports = Model;