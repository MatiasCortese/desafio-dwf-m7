import { types } from "util";
import { sequelize, DataTypes } from "./conn";

const Report = sequelize.define(
    'Report',
    {
        // Model attributes are defined here
        reporter_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reporter_phone_number: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        reporter_message: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },
        petOwnerEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        }
        
    }
);

export {Report, DataTypes};