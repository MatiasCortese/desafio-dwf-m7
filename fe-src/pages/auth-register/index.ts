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

customElements.define("register-page", class extends HTMLElement {
    constructor(){
        super();
    };
    connectedCallback(){
        this.render();
        this.addStyle();
        this.getDataForRegister();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Registrarse</my-title>
                <my-paragraph class="my-subtitle">Ingresá los siguientes datos para realizar el registro
                </my-paragraph>
                <form id="register-form">
                    <my-label for="email" type="email">EMAIL</my-label>
                    <my-input name="email" id="name-input"></my-input>
                    <my-label for="password" type="password">CONTRASEÑA</my-label>
                    <my-input name="password" type="password" id="password"></my-input>
                    <my-label for="confirm-password">CONFIRMAR CONTRASEÑA</my-label>
                    <my-input name="confirm-password" type="password" id="repeated-password"></my-input>
                <div class="register-container">
                    <my-paragraph>Ya tienes una cuenta?</my-paragraph><my-link href="/auth/login">Iniciá sesión</my-link>
                </div>
                    <my-button type="submit" buttonColor="blue" class="button">Siguiente</my-button>
                </form>
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
                justify-content: center;
            }
        `;
        this.appendChild(style);
    }
    async getDataForRegister(){
        if (!state.getState().email) {
            console.log("no hay email");
            Router.go("/auth");
        }
        const registerFormEl = document.querySelector("#register-form");
        const userEmail = await state.getState().email;
        // const mailInputEl = document.querySelector("#name-input");
        const registerData = {};
        registerFormEl.addEventListener("submit", async (e) => {
            e.preventDefault();
            const mailInputEl = document.querySelector("#name-input");
            const mailValue = (mailInputEl.firstChild as any).value;
            const passwordInputEl = document.querySelector("#password");
            const passwordValue = (passwordInputEl.firstChild as any).value;
            const repeatedPasswordInputEl = document.querySelector("#repeated-password");
            const repeatedPasswordValue = (repeatedPasswordInputEl.firstChild as any).value;
            // check si todos los campos están completos
            if(!mailValue || !passwordValue || !repeatedPasswordValue){
                console.log("Te faltan campos por completar");
            }
            // check si el email es == al mail del state
            if (mailValue != state.getState().email){
                console.log("Los correos no coinciden");
            } 
            // check si las passwords son iguales
            if(passwordValue != repeatedPasswordValue){
                console.log("las contraseñas no coinciden")
            }
            // si están completos, si el email es igual al del state y si las passwords son iguales, mandamos la info al state para que lo registre en la DB
            registerData["email"] = mailValue;
            registerData["password"] = passwordValue;
            const cs = await state.getState();
            cs.email = mailValue;
            cs.password = passwordValue;
            // función del state que registre al tipo
            await state.signUp();
            Router.go("/auth/login");
        })
    }
});