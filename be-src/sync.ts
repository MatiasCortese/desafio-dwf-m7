import { Sequelize, sequelize } from "./db/models/conn";
import { Pet, User, Report, Auth } from "./db/models/index";

sequelize.sync({FORCE: true})
.then(res => {
    console.log(res)
})