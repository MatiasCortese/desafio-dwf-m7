import { Auth, User } from "../db/models";
import * as crypto from "crypto";
import { hasSubscribers } from "diagnostics_channel";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
// DEFINIR EN ENV VAR DE RENDER
const SECRET = process.env.SECRET;

export function getSHA256ofString(text:string){
    return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex")
};

export async function createUserAuth(user){
    // SEGUIR DESDE ACÁ. ALGO NO ESTÁ FUNCIONANDO
    const { email, password } = user;
    if(!email || !password){
        throw "User or password missing"
    };
    const [auth, authCreated] = await Auth.findOrCreate({
        where: { UserId: user.id },
        defaults: {
            email,
            password: password,
            UserId: user.get("id")
        }
    });
};

// Sign in
// esta función chequea que en la tabla Auth los datos existan y concuerden, y si asi fuere, genera un token con un objeto que tenga solo el id del user. El token lo generamos con la lib jsonwebtoken
export async function authTokenizer(email, password){
    const hashedPassword = getSHA256ofString(password);
    const auth = await Auth.findOne({
        where: {
            email,
            password: hashedPassword
        }
    });
    
    if (auth) {
        const token = await jwt.sign({
            id: auth.get("UserId")},
            SECRET);
        // el token contiene adentro el id del usuario
        return token;
    } else {
        throw "Error"
    }
};

// recibimos el token del request, y si es válido, seguimos con el recorrido del endpoint si requiere un user auth
export async function authMiddleware(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
        // desencriptamos el token
        const data = jwt.verify(token, SECRET);
        req.user = data;
        next();
    }
    catch (e) {
        res.status(401).json({error: true})
    }
}

export async function getAuthById(id){
    try {
        const user = await Auth.findByPk(id);
        return user;
    }
    catch (e){
        console.log(e)
    }
}

export async function getAuthByUserId(UserId){
    try {
        const user = await Auth.findOne({
            where: { UserId: UserId }
        });
        return user;
    }
    catch (e){
        console.log(e)
    }
}

export async function getAuthByEmail(email){
    try {
        const user = await Auth.findOne({
            where: {
                email: email
            }
        });
        if(user == null){
            return "No existe";
        } else {
            console.log(user)
            return "Existe";
        }
    }
    catch (e){
        console.log(e)
    }
}


