import { sequelize, DataTypes } from "./conn";

const Auth = sequelize.define(
    'Auth',
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
    }
);

export {Auth, DataTypes};