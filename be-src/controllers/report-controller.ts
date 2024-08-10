import { Report, Pet, User } from "../db/models/index";

// esta función sirve para reportar como vista a una mascota 
export async function createReport(reportInfo){
    const { petId, reporter_name, reporter_phone_number, reporter_message, petOwnerEmail } = reportInfo;
    const pet = await Pet.findByPk(petId);
    if(!pet){
        return "not found a pet with that id"
    }
    const petOwner = await User.findByPk(pet.get("UserId"));
    // chequear del lado del front también
    const newReport = await Report.create({
        reporter_name, 
        reporter_phone_number, 
        reporter_message,
        PetId: pet.get("id"),
        petOwnerEmail: petOwnerEmail
    },{
        include: [ Pet ]
    });
    // ver por qué no funciona el includes Pet
    return newReport;
};