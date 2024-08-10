import * as dotenv from "dotenv";
import { parse } from "path";
import { setPetAsFound } from "../be-src/controllers/pet-controller";
dotenv.config();

const API_BASE_URL = "http://localhost:3003" || process.env.API_BASE_URL;
// const MAPBOX_TOKEN = SETEAR

const state = {
    data: {
        userId: "",
        email: "",
        emailRepetido: "",
        password: "",
        repetirPassword: "",
        full_name: "",
        user_localidad: "",
        userCurrentLocation: {
            lat: "",
            lng: ""
        },
        petId: "",
        petName: "",
        // este dato ya se está guardando en las pets al ser creadas. Ver como recuperarlo aca y traerlo
        petOwnerEmail: "",
        petFotoURL: "",
        pet_last_location_lat: "",
        pet_last_location_lng: "",
        pet_vista_por: "",
        pet_vista_por_telefono: "",
        pet_vista_en: "",
        pet_estado: "",
        reporter_name: "",
        reporter_phone_number: "",
        reporter_message: "",
        petsReportadas: "",
        mascotasPerdidasCerca: ""
    },
    listeners: [],
    getState(){
        return this.data;
    },
    getListeners(){
        return this.listeners;
    },
    async setState(newState){
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        };
    },
    async subscribe(callback: (any) => any){
        this.listeners.push(callback);
    },
    async removeListeners(){
        this.listeners = [];
    },
    // registro en la db
    async signUp(){
        const cs = this.getState();
        if(cs.email && cs.password){
            try {
                const response = await fetch(API_BASE_URL + "/auth", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email: cs.email,
                        password: cs.password
                    })
                })
                const data = await response.json();
                cs.userId = data.id;
                this.setState(cs);
            }
            catch (e) {
                console.log(`hubo un error ${e}`)
            }
        }
    },
    async checkUserIsRegistered(){
        const cs = await state.getState();
        if (cs.email) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/?email=${cs.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const data = await response.json();
                return data;
            }
            catch (e){
                console.error(`hubo un error ${e}`);
            }
        } else {
            console.error("no hay email")
        }
    },
    // para login
    async auth(){
        const cs = this.getState();
        if (cs.email && cs.password) {
            // pegada al endpoint para autenticar y tokenizar
            try {
                const response = await fetch(`${API_BASE_URL}/auth/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: cs.email,
                        password: cs.password
                    })
                });
                const token = await response.json();
                sessionStorage.setItem("token", token);
                this.setState(cs);
            }
            catch (e){
                console.error(`hubo un error ${e}`);
            }
        }
    },
    async login(){
        const cs = this.getState();
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/JSON",
                Authorization: `bearer ${sessionStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        cs.userId = data.userId;
        state.setState(cs);
        return data;
    },
    async logout(){
        sessionStorage.removeItem("token")
    },
    async createLostPetReport(){
        const cs = this.getState();
        cs.pet_estado = "perdido";
        console.log(`Me vieron en ${cs.pet_vista_en}`)
        console.log(`Soy el userId antes de enviarse a la mascota perdida ${cs.userId}`)
        const response = await fetch(`${API_BASE_URL}/pet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/JSON",
                Authorization: `bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                nombre: cs.petName,
                foto: cs.petFotoURL,
                last_location: {
                    lat: cs.pet_last_location_lat,
                    lng: cs.pet_last_location_lng
                },
                estado: cs.pet_estado,
                pet_vista_en: cs.pet_vista_en,
                // ver cómo hacer llegar esta data al state al logearse
                UserId: cs.userId,
                UserEmail: cs.email
            })
        })
        const data = await response.json();
        console.log(data)
        return data;
    },
    async getMyReportedPets(){
        const cs = this.getState();
        if(cs.userId){
            const response = await fetch (`${API_BASE_URL}/user/${cs.userId}/pets`, {
                method: "GET"
            });
            const data = await response.json();
            cs.petsReportadas = data;
            this.setState(cs);
        };
    },
    async getMascotasPerdidasCerca(){
        const cs = this.getState();
        if(cs.userCurrentLocation.lat && cs.userCurrentLocation.lng){
            const response = await fetch(`${API_BASE_URL}/pet/search/location?lat=${cs.userCurrentLocation.lat}&lng=${cs.userCurrentLocation.lng}`, {
                method: "GET"
            });
            const data = await response.json();
            cs.mascotasPerdidasCerca = data;
            this.setState(cs);
        } else {
            console.log("No hay lat & lng")
        }
    },
    async reportLostPetInformation(){
        const cs = await this.getState();
        if(!cs.petId || !cs.reporter_name || !cs.reporter_phone_number || !cs.reporter_message || !cs.petOwnerEmail || !cs.petName){
            console.log("there is not enough info to report")
        };
        const response = await fetch(`${API_BASE_URL}/report`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                petId: cs.petId,
                reporter_name: cs.reporter_name,
                reporter_phone_number: cs.reporter_phone_number,
                reporter_message: cs.reporter_message,
                petOwnerEmail: cs.petOwnerEmail,
                petName: cs.petName
                // ver cómo hacer llegar esta data al state al logearse
            })
        })
        const data = await response.json();
        console.log(data);
        return data;
        // Ya tenemos la info. Ahora hay que ver como pinga mandar el mail
    },
    async changePetInfo(){
        const cs = await this.getState();
        if(!cs.petName || !cs.pet_vista_en || !cs.petFotoURL || !cs.petId){
            console.log("falta info");
        }
        
        const response = await fetch(`${API_BASE_URL}/pet/edit`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/JSON",
                Authorization: `bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                petId: cs.petId,
                petName: cs.petName,
                petFotoURL: cs.petFotoURL,
                pet_vista_en: cs.pet_vista_en
            })
        });
        const data = await response.json();
        console.log(data);
        return data;
    },
    async changeUserInfo(){
        const cs = await this.getState();
        if(!cs.userId || !cs.full_name || !cs.user_localidad){
            console.log("falta info");
        }
        console.log(`Soy la data antes de ser enviada desde el endpoint ${cs.userId}, ${cs.full_name}, ${cs.user_localidad}`)
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/JSON",
                // Authorization: `bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                userId: cs.userId,
                full_name: cs.full_name,
                user_localidad: cs.user_localidad,
            })
        });
        const data = await response.json();
        console.log(data);
        return data;
    },
    async getUserInfo(){
        const cs = this.getState();
        if (cs.userId) {
            const userIdStr = cs.userId.toString();
            try {
                const response = await fetch(`${API_BASE_URL}/user/${userIdStr}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const data = await response.json();
                cs.full_name = data.user.full_name;
                cs.user_localidad = data.user.localidad;
                await state.setState(cs);
            }
            catch (e){
                console.error(`hubo un error ${e}`);
            }
        } else {
            console.error("no hay email")
        }
    },
    async changePassword(){
        const cs = this.getState();
        if (cs.userId && cs.password && cs.repetirPassword){
                if(cs.password == cs.repetirPassword){
                    try {
                        const response = await fetch(`${API_BASE_URL}/user/password`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `bearer ${sessionStorage.getItem("token")}`
                            },
                            body: JSON.stringify({
                                userId: cs.userId,
                                newPassword: cs.repetirPassword,
                            })
                        })
                        const data = await response.json();
                        console.log(data)
                    }
                    catch (e){
                        console.log(e)
                    } 
                }
        }
    },
    async setPetAsFound(){
        const cs = this.getState();
        if(!cs.petId){
            console.log("falta info");
        }
        const response = await fetch(`${API_BASE_URL}/pet/find`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/JSON",
                Authorization: `bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                petId: cs.petId,
            })
        });
        const data = await response.json();
        console.log(data);
        return data;
    },
    async deletePet(){
        const cs = this.getState();
        if(!cs.petId){
            console.log("falta info");
        }
        const response = await fetch(`${API_BASE_URL}/pet/${cs.petId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/JSON",
                Authorization: `bearer ${sessionStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        return data;
    }
}

export {state};