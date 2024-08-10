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


// SEGUIR DE ACÁ. ESTA PAGE TIENE QUE LLAMAR A UN MÉTODO DEL STATE QUE, EN BASE AL USERID, SE FIJE SI TIENE MASCOTAS REPORTADAS COMO PERDIDAS Y LAS MUESTRE
customElements.define("my-reported-pets-page", class extends HTMLElement {
    misMascotasReportadas;
    imgUrl;
    petName;
    petLocation;
    backgroundImg;
    constructor(){
        super();
        this.backgroundImg = require("url:../../images/undraw_post_re_mtr4 1.png")

    };
    async connectedCallback(){
        await this.render();
        await this.addStyle();
        await this.handleEditPet();
    };
    async render(){
        await state.getMyReportedPets();
        const cs = await state.getState();
        this.misMascotasReportadas = cs.petsReportadas;
        let cards = "";
        if (this.misMascotasReportadas) {
            // no funciona la función. Ver BIEN ESTO
            await this.misMascotasReportadas.pets.forEach((pet) => {
                cards += `
                    <pet-card petName=${pet.nombre} petId="${pet.id}" petVistaEn="${pet.pet_vista_en}" estado="${pet.estado}"imageUrl=${pet.foto} class="pet-card" buttonColor="blue">Editar</pet-card> 
                `
            })
        }
        else {
            cards = `
                <my-paragraph>Aún no reportaste mascotas perdidas</my-paragraph>
                <img src="${this.backgroundImg}">
                <my-button class="publicar-button" buttonColor="blue">Publicar reporte</my-button>
            `
        }
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title type="bold">Mascotas reportadas</my-title>
                <div class="mascotas-container">
                    ${cards}
                </div>
            </div>
        `;
    };
    async addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
            .container {
            display: flex;
                padding: 50px 85px 80px 75px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
                background: #DEF4F0;
                height: auto;
            }

            .publicar-button {
                width: 335px
            
            }
        `;
        this.appendChild(style);
    }
    handleEditPet(){
        const editReportBtns = this.querySelectorAll("#report-button");
        editReportBtns.forEach((editBtn) => {
            editBtn.addEventListener("click", () => {
                const cs = state.getState();
                const petCard = editBtn.closest("pet-card");
                cs.petName = petCard.getAttribute("petName");
                cs.petId = petCard.getAttribute("petId");
                cs.pet_vista_en = petCard.getAttribute("petVistaEn");
                cs.petFotoURL = petCard.getAttribute("imageUrl");
                cs.pet_estado = petCard.getAttribute("estado");
                state.setState(cs);
                Router.go(`/report/${cs.petId}`);
            })
        }
    )}
});