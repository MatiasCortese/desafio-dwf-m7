import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { changeUserData, createUser, getUser, changePassword } from "./controllers/user-controller";
import { getAllPets, createPet, getUserLostPets, getLostPetsByGeolocation, editLostPet, setPetAsFound, deletePet} from "./controllers/pet-controller";
import { authTokenizer, getAuthById, authMiddleware, getAuthByEmail, getAuthByUserId } from "./controllers/auth-controller";
import { createReport } from "./controllers/report-controller";
import { transporter } from "./lib/nodemailer";

const app = express();
const port = process.env.PORT || 3003;
const path = process.env.PATH;

// Increase payload size limit
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cors());

// Sign up - registro
app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    const newUser = await createUser({
        email,
        password,
    });
    res.json({newUser})
});

app.get("/auth", async (req, res) => {
    const { email } = req.query;
    const response = await getAuthByEmail(email);
    res.json(response);
});

app.get("/me", authMiddleware, async (req, res) => {
    const userId = req["user"].id;
    res.json({message: "Soy el id del user", userId})
    // acá ahora hay que ver como extraer el userID del token para poder usarlo para obtener la data del user
});

// no será login?
// sign in - si existe el user, te devuelve el token
app.post("/auth/token", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authTokenizer(email, password);
        // esta info hay que mandarla al frontend y guardarla en LS
        res.json(token)
    } catch (e) {
        res.status(400).json({error: `error: email o pass incorrecto`});
    }
});

app.get("/searchAuth/:id", async (req, res) => {
    const id = req.params.id;
    const userAuth = await getAuthById(id);
    res.json({userAuth})
});

// reporta una mascota como perdida. Aparte de crear la oet
app.post("/pet", authMiddleware, async (req, res) => {
    const { nombre, foto, last_location, estado, pet_vista_en, UserId, UserEmail } = req.body;
    const newPet = await createPet({
        nombre, 
        foto,
        // {lat, lng}
        last_location,
        // perdido o encontrado
        estado,
        pet_vista_en,
        UserId,
        UserEmail
    });
    res.json({newPet, id: newPet["id"]})
});

app.get("/user/:userId",  async (req, res) => {
    const userId = req.params.userId;
    const user = await getUser(userId);
    res.json({user})
});

app.get("/user/:userId/pets", async (req, res) => {
    const userId = req.params.userId;
    try {
        const pets = await getUserLostPets(userId);
        res.json({pets})
    }
    catch (e) {
        console.log("hubo un error", e)
    }   
});

app.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await getUser(userId);
        res.json({"my pets": user})
    }
    catch (e) {
        console.log("hubo un error", e)
    }   
});

// ver bien este endpoint si sirve para, desde mis datos, agregar el full_name y location del user
app.patch("/user", authMiddleware, async (req, res) => {
    const { userId, full_name, user_localidad} = req.body;
    try {
        const editedUser = await changeUserData(userId, full_name, user_localidad);
        res.json({editedUser})
    } 
    catch (e) {
        res.json(e)
    }
});

app.get("/pet/search/location", async (req, res) => {
    // acá actuaría un controller que va a la DB y busca las pets cerca de esa lat y lng y devuelve un listado. Peero acá hay que usar algolia
    const { lat, lng } = req.query;
    try {
        const lostPets = await getLostPetsByGeolocation({lat, lng});
        res.json(lostPets)
    }
    catch (e) {
        res.json(`hubo un error ${e}`)
    }
});

app.post("/report", async (req, res) => {
    const { petId, reporter_name, reporter_phone_number, reporter_message, petOwnerEmail, petName} = req.body;
    if(!petId || !reporter_name || !reporter_phone_number || !reporter_message || !petOwnerEmail || !petName) {
        res.json({message: "missing info"})
    }
    const newReport = await createReport({petId,
        reporter_name, reporter_phone_number, reporter_message, petOwnerEmail
    });
    const mailInfo = {
        from: {
            name: "Pet Finder App",
            address: "petfinderapp.apx@gmail.com"
        },
        to: [petOwnerEmail],
        subject: `Tu mascota ${petName} fue encontrada!`,
        text: `Tu mascota ${petName} fue vista! Te dejamos el mensaje de quien la vió: ${reporter_message}. Podés contactarlo al ${reporter_phone_number}`,
        html: `<p>Tu mascota ${petName} fue vista! Te dejamos el mensaje de quien la vió: ${reporter_message}. Podés contactarlo al ${reporter_phone_number}</p>`
    };
    await transporter.sendMail(mailInfo);
    res.json({newReport})
});

app.patch("/pet/edit", authMiddleware, async (req, res) => {
    console.log("Dentro del endpoint")
    const { petId, petName, petFotoURL, pet_vista_en } = req.body;
    if(!petId || !petName || !pet_vista_en || !pet_vista_en){
        res.send("Faltan datos loko");
    }
    const petData = {
        petId, petName, petFotoURL, pet_vista_en
    }
    const petEditada = await editLostPet(petData);
    res.json({petEditada});
});

app.post("/user/password", authMiddleware, async (req, res) => {
    const {userId, newPassword } = req.body;
    try {
        const passwordChanged = await changePassword(userId, newPassword)
        res.json({passwordChanged});
    }
    catch (e){
        res.json(`Hubo un error ${e}`)
    }
})

app.patch("/pet/find", authMiddleware, async (req, res) => {
    const { petId } = req.body;
    if(!petId){
        res.send("Faltan datos loko");
    }
    const petEncontrada = await setPetAsFound(petId);
    res.json({petEncontrada});
});

app.delete("/pet/:petId", authMiddleware, async (req, res) => {
    const petId  = req.params.petId;
    if(!petId){
        res.send("Faltan datos loko");
    }
    const petEliminada = await deletePet(petId);
    res.json({petEliminada});
})

app.get("/pet/all", async (req, res) => {
    const pets = await getAllPets();
    res.json({pets})
})

app.listen(port, ()=>{
    console.log("todo chido en el ", port);
});