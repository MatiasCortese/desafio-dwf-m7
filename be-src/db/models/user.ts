import { sequelize, DataTypes } from "./conn";

const User = sequelize.define(
    'User',
    {
        // Model attributes are defined here
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        localidad: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }
);

export {User, DataTypes};