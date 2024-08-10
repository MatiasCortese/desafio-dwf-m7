import "../../components/header";
import "../../components/button";
import "../../components/title";
import "../../components/subtitle";
import "../../components/paragraph";
import "../../components/bold-paragraph";
import "../../components/label";
import "../../components/link";
import "../../components/input";
import "../../components/pet-card";
import "../../components/reportar-modal";
import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define("home-mascotas-page", class extends HTMLElement {
    imgUrl;
    mascotasPerdidasCerca;
    constructor(){
        super();
    };
    async connectedCallback(){
        await state.removeListeners();
        await state.getMascotasPerdidasCerca();
        const cs = await state.getState();
        this.mascotasPerdidasCerca = cs.mascotasPerdidasCerca;
        await this.render();
        await this.addStyle();
        await this.generarPetCards();
        await this.handleModalOpening();
        await this.handleModalClosing();
    };
    async render(){
        this.innerHTML = "";
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-subtitle type="bold">Mascotas perdidas cerca</my-subtitle>
                <div class="mascotas-container">
                ${await this.generarPetCards()}
                </div>
            </div>
            <my-modal buttonColor="green" class="modalPet hidden"></my-modal>
        `
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
            .container {
                padding: 50px 85px 80px 75px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
                background: #DEF4F0;
            }
            
            .blur {
                filter: blur(10px);
            }

            .hidden {
                display: none;
            }

            .showModal {
                position: fixed;
                top: 8%;
                left: 10%;
            }
        `;
        this.appendChild(style);
    }
    async generarPetCards(){
        let petCardsHTML = ""; // Variable para almacenar el HTML de las tarjetas de mascotas
        if (this.mascotasPerdidasCerca) {
            // Recorrer cada mascota y generar el HTML correspondiente
            await this.mascotasPerdidasCerca.forEach(pet => {
                    petCardsHTML += `
                        <pet-card 
                            petName="${pet.nombre}" 
                            petId="${pet.id}" 
                            petVistaEn="${pet.pet_vista_en}" 
                            imageUrl="${pet.foto}" 
                            class="pet-card" 
                            buttonColor="red"
                            ownerEmail="${pet.UserEmail}"
                        >
                            Reportar
                        </pet-card>
                    `;
                
            });
        }
    return petCardsHTML;
    }
    handleModalOpening(){
        const reportBtnsEl = this.querySelectorAll("card-button");
        reportBtnsEl.forEach(reportBtn => {
            reportBtn.addEventListener("click", (e) => {
                // todo esto podría meterse en una función que sea openModal(){}?
                const card = reportBtn.closest("pet-card");
                const cs = state.getState();
                this.querySelector(".container").classList.toggle("blur");
                // obtener el ID de la pet
                cs.petId = card.getAttribute("petid");
                cs.petName = card.getAttribute("petname");
                cs.petOwnerEmail = card.getAttribute("ownerEmail");
                // hacer que en el titulo del modal se muestre el nombre de la pet
                this.querySelector(".modalPet").querySelector(".title").innerHTML = `Reportar info de ${cs.petName}`;
                this.querySelector(".modalPet").classList.toggle("hidden");
                this.querySelector(".modalPet").classList.toggle("showModal");
                state.setState(cs);
                this.handlePetNewInfo();
            })
        })
    }
    handleModalClosing(){
        this.querySelector(".close").addEventListener("click", () => {
            const cs = state.getState();
            this.querySelector("my-modal").classList.toggle("hidden");
            this.querySelector("my-modal").classList.toggle("showModal");
            this.querySelector(".container").classList.toggle("blur");
            cs.petId = "";
            cs.petName = "";
            state.setState(cs);
        })
    }
    handlePetNewInfo(){
        this.querySelector(".submit-button").addEventListener("click", async (e) => {
            const reporter_name = (this.querySelector("#name") as any).value;
            const reporter_phone_number = (this.querySelector("#phone") as any).value;
            const reporter_message = (this.querySelector("#message") as any).value;
            e.preventDefault();
            if(!reporter_name || !reporter_phone_number || !reporter_message) {
                console.log("information missing");
            }
            const cs = state.getState();
            cs.reporter_name = reporter_name;
            cs.reporter_phone_number = reporter_phone_number;
            cs.reporter_message = reporter_message;
            await state.setState(cs);
            await state.reportLostPetInformation();
            alert("Pet reportada");
        })
    }
});