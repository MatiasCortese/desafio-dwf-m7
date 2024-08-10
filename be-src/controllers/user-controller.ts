import { User } from "../db/models/index";
import { createUserAuth, getAuthByUserId, getSHA256ofString } from "./auth-controller";

// Esta función crea un registro en la tabla users y auth. El primero para generar el id del user y, después, para generar el registro en la tabla auth con email, password y userId
export async function createUser(userInfo){
    const { email, password} = userInfo;
    if (!email || !password) {
        throw "Faltan datos fundamentales"
    };
    // esto que devuelve es una tupla. Un array con valores. El primer valor representa al user sea creado o encontrado. El segundo es un flag boolean que da true o false segun haya sido creado o no
    const [user, created] = await User.findOrCreate({
        where: { email: email },
        defaults: {
            email,
            password: getSHA256ofString(password)
        }
    });
    // llamada a la función de Auth
    if (created) {
        const auth = await createUserAuth(user);
        return [user, created, auth];
    };
    console.log("el user ya existe")
    return {
        "user:": user,
        "es nuevo?": created
    };
};

export async function getUser(id){
    try {
        const user = await User.findByPk(id);
        return user;
    }
    catch (e) {
        console.log("hubo un error en el model", e)
    }
};

export async function changeUserData(userId, full_name, user_localidad){
    const user = await User.findByPk(userId);
    if(!user){
        return "No hay un user con dicho ID"
    }
    if(full_name){
        user.full_name = full_name;
        await user.save();
        // SEGUIR DESDE ACÁ VER POR QUÉ NO SE MODIFICA ESTO
    }
    if (user_localidad) {
        user.localidad = user_localidad;
        await user.save();
    }
    console.log(`Soy el user desde el controller ${user}`);
    return user;
};

export async function changePassword(userId, newPassword){
    // pensar bien esto. La password la tenemos tanto en el user User y en el user Auth
    // cómo obtenemos una referencia al user en User y al user en Auth?
    // ya tenemos las referencias al user en Auth y en User
    if(!userId || !newPassword){
        console.log("Faltan datos");
    }
    const userInUser = await User.findByPk(userId);
    const userInAuth = await getAuthByUserId(userId);
    if(userInUser.id == userInAuth.UserId){
        // cambiar la password (hasheada) en user
        userInUser.password = getSHA256ofString(newPassword);
        await userInUser.save();
        console.log(userInUser)
        userInAuth.password = getSHA256ofString(newPassword);
        await userInAuth.save();
        console.log(userInAuth)
    }
    else {
        console.log("Los datos no coinciden")
    }
}
