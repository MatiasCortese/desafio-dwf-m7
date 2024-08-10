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

customElements.define("change-pass-page", class extends HTMLElement {
    email;
    password;
    passwordRepetida;
    constructor(){
        super();
        this.email = "matute@apx.com";
        this.password;
        this.passwordRepetida;
    };
    connectedCallback(){
        const cs = state.getState();
        if (!cs.userId) {
            Router.go("/auth/login")
        }
        this.render();
        this.addStyle();
        this.handlePassword();
        this.handleConfirmPassword();
        this.handleSave();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Contraseña</my-title>
                    <div>
                        <my-label for="contraseña" type="password">CONTRASEÑA</my-label>
                        <input id="new-password" name="contraseña" class="input" type="password">
                        <my-label for="contraseña" type="password">CONFIRMAR CONTRASEÑA</my-label>
                        <input name="contraseña" type="password" class="input" id="confirm-password">
                        <my-button buttonColor="blue" id="save-button">Guardar</my-button>
                    </div>
            </div>
        `
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
            .container {
                padding: 0px 85px 80px 75px;
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

            .input {
                width: 335px;
                height: 50px;
                margin-top: 24px;
                box-shadow: #000000 25%;
                border-radius: 4px;
                border: none;
                box-shadow: 0.25%;
                margin-bottom: 25px;
            }
        `;
        this.appendChild(style);
    }
    handlePassword(){
        const newPasswordInputEl = document.querySelector("#new-password");
        newPasswordInputEl.addEventListener("change", async (e) => {
            e.preventDefault();
            const event = (e as any);
            const newPassword = event.target.value;
            this.password = newPassword;
        })
    }
    handleConfirmPassword(){
        const confirmarPasswordInputEl = document.querySelector("#confirm-password");
        confirmarPasswordInputEl.addEventListener("change", async (e) => {

            e.preventDefault();
            const event = (e as any);
            const confirmPassword = event.target.value;
            this.passwordRepetida = confirmPassword;
        }
    )}
    handleSave(){
        const saveBtn = document.querySelector("#save-button");
        saveBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const cs = state.getState();
            if(!this.password || !this.passwordRepetida) {
                console.log("faltan contraseñas");
            }
            if(this.password != this.passwordRepetida) {
                console.log("las contraseñas no coinciden");
            }
            cs.password = this.password;
            cs.repetirPassword = this.passwordRepetida;
            await state.setState(cs);
            await state.changePassword();
            alert("Contraseña cambiada exitosamente");
        })
    }
});