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
import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define("auth-page", class extends HTMLElement {
    imgUrl;
    constructor(){
        super();
        this.imgUrl = require("url:../../images/undraw_login_re_4vu2 1.png")
    };
    connectedCallback(){
        state.getListeners();
        this.render();
        this.addStyle();
        this.getEmail();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <img class="img" src="${this.imgUrl}">
                <my-title class="home-title black">Ingresar</my-title>
                <my-paragraph class="my-subtitle">Ingresá tu email para continuar.</my-paragraph>
                <form class="form">
                    <my-label for="email" type="email">EMAIL</my-label>
                    <my-input type="email" name="email"></my-input>
                    <my-button type="submit" buttonColor="blue" class="button" id="siguiente">Siguiente</my-button>
                </form>
                <div class="register-container">
                    <my-paragraph>Aún no tienes cuenta?</my-paragraph><my-link href="/auth/register">Regístrate</my-link>
                </div>
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
                width: 100%;
            }
            
            .register-container {
                display: flex;
                align-items: center;
                gap: 5px;
            }
        `;
        this.appendChild(style);
    }
    getEmail(){
        const formSiguienteEl = this.querySelector("#siguiente");
        formSiguienteEl.addEventListener("click", async (e) => {
            e.preventDefault();
            const email = (this.querySelector(".input") as any).value;
            if (!email){
                alert("Por favor ingresa un correo electrónico")
            }
            // mandamos el email al state
            const cs = await state.getState();
            cs.email = email;
            await state.setState(cs);
            // vemos si el user está registrado o no
            const response = await state.checkUserIsRegistered();
            // si el mail no existe en la db, lo mandamos a register
            if(response === "No existe"){
                Router.go("/auth/register")
            }
            // si el email existe en la db, lo mandamos a login
            else {
                Router.go("/auth/login");
            }
        })
    }
});