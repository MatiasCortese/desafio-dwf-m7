// import { Pet } from "../db/models/pet";
import { Pet, User } from "../db/models/index";
import { lostPetsCollection } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

// createPet - la crea en Postgres y en Algolia. Sirve para dar como perdida a una mascota y poder recibir reportes de quienes la vean
export async function createPet(petInfo){
    const { nombre, foto, last_location, estado, pet_vista_en, UserId, UserEmail } = petInfo;
    console.log(`Soy el UserId que me llega desde el endpoint ${UserId}`)
    // para crear una pet tiene que haber un user
    if (!nombre || !foto || !last_location || !estado ||!pet_vista_en || !UserId || !UserEmail) {
        throw "Faltan datos"
    }
    try {
        const user = await User.findByPk(UserId);
        const uploadResult = await cloudinary.uploader.upload(foto);
        const newPet = await Pet.create({
            nombre,
            foto: uploadResult.url,
            // mandar en formato _geoloc 
            last_location,
            estado,
            pet_vista_en: pet_vista_en,
            UserId: user.get("id"),
            UserEmail: UserEmail
        },{
            includes: [ User ]
        });
        // acá también hay que crear a la pet en algolia
        const petEnAlgolia = await lostPetsCollection.saveObject({
            objectID: newPet.get("id"),
            nombre,
            pet_vista_en,
            _geoloc: {
                lat: last_location.lat,
                lng: last_location.lng
            },
        });
        return {newPet, petEnAlgolia};
    }
    catch (e) {
        console.log("hubo un error ", e)
    }
};

export async function getUserLostPets(userId){
    const userLostPets = await Pet.findAll({
        where: {
            UserId: userId
        },
        include: [User],
    });
    return userLostPets;
};

export async function getLostPetsByGeolocation({lat, lng}){
    // esto se hace en algolia, se obtienen los ids y después se buscan en Postgres
    try {
        const nearPets = await lostPetsCollection.search("", {
            aroundLatLng: `${lat},${lng}`,
            // son 10km
            aroundRadius: 10000
        });
        // si hay petsNear, buscalas en Postgres
        // petsNear.hits devuelve una collection (array de objetos) de Algolia con cada pet cerca. Lo que deberiamos hacer ahora, es recorrer esa collection y en base a su id ir buscandolo en Postgres.
        const petsNearInPostgres = await getNearPetsInPostgres(nearPets);
        return petsNearInPostgres;
    }
    catch (e) {
        console.log(`Hubo un error ${e}`)
    }
};

async function getNearPetsInPostgres(nearPets){
    const nearPetsInPostgres = await Promise.all(nearPets.hits.map(async(petInAlgolia) => {
        const nearPet = await Pet.findByPk(petInAlgolia.objectID);
        return nearPet;
    }));
    return nearPetsInPostgres;
};

export async function editLostPet(data){
    const { petId, petName, petFotoURL, pet_vista_en} = data;
    const pet = await Pet.findByPk(petId);
    if(!pet){
        return "Pet does not exist";
    }
    const uploadResult = await cloudinary.uploader.upload(petFotoURL);
    if(petName){
        pet.nombre = petName;
        await pet.save();
    }
    if(uploadResult){
        //  ojota acá hay que pasarla x cloduinary
        pet.foto = uploadResult.url;
        await pet.save();
    }
    if(pet_vista_en){
        pet.pet_vista_en = pet_vista_en;
        await pet.save();
    }
    console.log(pet)
    return pet;
}

export async function setPetAsFound(petId){
    const pet = await Pet.findByPk(petId);
    if (!pet){
        return "No se ha encontrado una pet con dicho ID"
    }
    if (pet && pet.estado == "encontrado"){
        return "esta pet ya fue encontrada"
    }
    if(pet.estado == "perdido"){
        pet.estado = "encontrado";
        await pet.save();
        return pet;
    }
};

export async function deletePet(petId){
    const petInPostgres = await Pet.findByPk(petId);
    const petInAlgolia = await lostPetsCollection.getObject(petId);
    if (!petInPostgres || !petInAlgolia){
        return "No se ha encontrado una pet con dicho ID"
    }
    if(petInPostgres && petInAlgolia){
        await petInPostgres.destroy();
        return `Pet ${petId} eliminada exitosamente`
    }
    return {petInPostgres, petInAlgolia}
}

export async function getAllPets(){
    const pets = await Pet.findAll();
    return pets;
}

