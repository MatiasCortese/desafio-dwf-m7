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
import { getUserLocation } from "../../utils";
import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define("home-page", class extends HTMLElement {
    imgUrl;
    constructor(){
        super();
        this.imgUrl = require("url:../../images/home-image.png")
    };
    connectedCallback(){
        // await state.subscribe(()=>{
        //     this.render();
        // })
        this.render();
        this.addStyle();
        this.getLocation();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <img class="img" src="${this.imgUrl}">
                <my-title class="home-title">Pet Finder App</my-title>
                <my-subtitle>Encontrá y reportá mascotas perdidas cerca de tu ubicación</my-subtitle>
                <my-button buttonColor="blue" class="button" id="location">Dar mi ubicación actual</my-button>
                <my-button buttonColor="green" class="button">¿Cómo funciona Pet Finder?</my-button>
            </div>
        `
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
            .container {
                padding: 0px 85px 80px 75px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
                background: linear-gradient(191.08deg, #FFFFFF 8.17%, #DEF4F0 62.61%);
                height: 100vh;
            }

            .img {
                width: 215.42px;
                height: 235px;
            }

            .title {
                font-size: 36px;
                color: #EB6372;
            }

            .button {
                width: 270px;
            }
        `;
        this.appendChild(style);
    }
    async getLocation(){
        const locationBtn = this.querySelector("#location");
        locationBtn.addEventListener("click", async () => {
            try {
                const location = await getUserLocation();
                const cs = await state.getState();
                cs.userCurrentLocation.lat = location["lat"];
                cs.userCurrentLocation.lng = location["lng"];
                console.log(cs.userCurrentLocation)
                await state.setState(cs);
                Router.go("/home/mascotas");
            }
            catch (e) {
                console.error(`Hubo un error `, e)
            }
        });
    }
});