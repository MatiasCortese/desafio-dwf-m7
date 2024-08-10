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

customElements.define("login-page", class extends HTMLElement {
    constructor(){
        super();
    };
    async connectedCallback(){
        await state.subscribe(()=>{
            this.render();
            this.addStyle();
            this.getFormData();
        })
        this.render();
        this.addStyle();
        this.getFormData();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Iniciar sesión</my-title>
                <my-paragraph class="my-subtitle">Ingresá los siguientes datos para iniciar sesión.</my-paragraph>
                <form id="form">
                    <my-label for="email" type="email">EMAIL</my-label>
                    <my-input name="email" id="name-input"></my-input>
                    <my-label for="password" >CONTRASEÑA</my-label>
                    <my-input name="password" type="password" id="login-password"></my-input>
                    <div class="register-container">
                        <my-link href="/home">Olvidé mi contraseña</my-link>
                </div>
                    <my-button type="submit" buttonColor="blue" class="button">Acceder</my-button>
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
            }
        `;
        this.appendChild(style);
    }
    // acá tiene que haber una función que levante los inputs de login (email y password) y haga un state.loginUser()
    async getFormData(){
        const formEl = this.querySelector("#form");
        formEl.addEventListener("submit", async (e) => {
            const mailInputEl = document.querySelector("#name-input");
            const mailValue = (mailInputEl.firstChild as any).value;
            const passwordInputEl = document.querySelector("#login-password");
            const passwordValue = (passwordInputEl.firstChild as any).value;
            e.preventDefault();
            if(!mailValue || !passwordValue) {
                console.log("Faltan campos por completar")
            }
            const cs = await state.getState();
            cs.email = mailValue;
            cs.password = passwordValue;
            await state.setState(cs);
            await state.auth();
            const loginResponse = await state.login();
            if (loginResponse.error == true){
                alert("Credenciales inválidas/user inexistente")
                Router.go("/auth/login");
            }
            if (loginResponse.userId){
                await state.getUserInfo();
                Router.go("/home");
            }
        })
    }


});