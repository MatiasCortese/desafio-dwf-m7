import { Auth } from "./auth";
import { Pet } from "./pet";
import {Report} from "./report";
import { User } from "./user";

// armar relaciones y exportar 
User.hasOne(Auth);
Auth.belongsTo(User);
User.hasMany(Pet);
Pet.belongsTo(User);
Pet.hasMany(Report);
Report.belongsTo(User);
Report.hasOne(Pet);
User.hasMany(Report);

export { Auth, Pet, Report, User };



// Un usuario puede tener muchas mascotas
// Una pet tiene un usuario que lo perdió/reportó
// Un reporte va relacionado a una mascota
