import { types } from "util";
import { sequelize, DataTypes } from "./conn";

const Pet = sequelize.define(
    'Pet',
    {
        // Model attributes are defined here
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foto: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        last_location: {
            // aca va un objeto de algolia _geoloc - seguir desde acá
            type: DataTypes.JSONB,
            allowNull: false,
        },
        // este si va relacionado a la tabla User en su user.Id - reportado_por
        reports: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        // este dato no es necesario que vaya relacionado al ID de un/unos users. La idea es que cualquiera, sin registrarse, pueda comentar que vió a la mascota
        visto_por: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        // ver como relacionar esto iria con el visto_por.id.telefono
        telefono_visto_por: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pet_vista_en: {
            // cada JSON va a tener _geoloc de algolia
            type: DataTypes.STRING,
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('perdido', 'encontrado'),
            allowNull: false,
        },
        UserEmail: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
);

export {Pet, DataTypes};


