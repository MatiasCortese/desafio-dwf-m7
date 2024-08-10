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
import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define("my-profile-page", class extends HTMLElement {
    email;
    constructor(){
        super();
        const cs = state.getState();
        if (cs.userId == "") {
            Router.go("/auth");
        }
    };
    async connectedCallback(){
        this.render();
        this.addStyle();
        this.handleDatosPersonales();
        this.handlePassword();
        this.checkIfUserLoged();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Mis datos</my-title>
                    <my-button type="" buttonColor="blue" class="button" id="datos-personales">Modificar datos personales</my-button>
                    <my-button type="" buttonColor="blue" class="button" id="password">Modificar contraseña</my-button>
                    <my-paragraph class="email">${this.email}</my-paragraph>
                    <my-link href="">CERRAR SESIÓN</my-link>
            </div>
        `
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
            .container {
                padding: 50px 85px 80px 75px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
                background-color: #DEF4F0;
                height: 90vh;
            }

            .img {
                width: 340.3px;
                height: 205px;
            }

            .title {
                font-size: 36px;
                color: #000000;
                font-weight: 700;
                font-size: 36px;
                line-height: 54px;
            }

            .my-subtitle {
                font-weight: 400px;
                font-size: 16px;
                line-height: 18.75px;
                font-family: "Roboto", sans-serif;
            }

            .button {
                margin-top: 25px;
                width: 335px;
            }
            
            .register-container {
                display: flex;
                align-items: center;
                gap: 5px;
                justify-content: center;
            }

            .email {
                margin-top: 199px;
            }
        `;
        this.appendChild(style);
    }
    handleDatosPersonales(){
        const modificarDatosBtnEl = this.querySelector("#datos-personales");
        modificarDatosBtnEl.addEventListener("click", () => {
            Router.go("/me/data")
        })
    }
    handlePassword(){
        const passwordBtnEl = this.querySelector("#password");
        passwordBtnEl.addEventListener("click", () => {
            Router.go("/me/password")
        })
    }
    checkIfUserLoged(){
        const cs = state.getState();
        if(cs.userId === ""){
            Router.go("/auth")
        }
    }
    }// Llama a initializeHamburgerMenu() al cargar o al cambiar de página
);