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

customElements.define("change-data-page", class extends HTMLElement {
    full_name;
    user_localidad;
    constructor(){
        super();
        const cs = state.getState();
        if (cs.full_name != undefined) {
            this.full_name = cs.full_name;
        } else {
            this.full_name = "";
        }
        if (cs.user_localidad != undefined) {
            this.user_localidad = cs.user_localidad;
        }
        else {
            this.user_localidad = "";
        }
    };
    connectedCallback(){
        this.render();
        this.addStyle();
        this.handleFullName();
        this.handleLocalidad();
        this.handleSave();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Datos personales</my-title>
                    <form>
                        <my-label for="nombre" type="text">NOMBRE</my-label>
                        <my-input name="nombre" previousinfo="${this.full_name}" id="name-input"></my-input>
                        <my-label for="localidad" type="text">LOCALIDAD</my-label>
                        <my-input name="localidad" previousinfo="${this.user_localidad}" id="localidad-input"></my-input>
                        <my-button id="save-button" type="submit" buttonColor="blue" class="button">Guardar</my-button>
                </form>
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
        `;
        this.appendChild(style);
    }
    handleFullName(){
        const nameInputCompEl = document.querySelector("#name-input");
        const nameInputEl = nameInputCompEl.querySelector("input");
        nameInputEl.addEventListener("change", async (e) => {
            state.listeners = [];
            const cs = state.getState();
            const event = (e as any);
            const newName = event.target.value;
            cs.full_name = newName;
            this.full_name = newName;
            await state.setState(cs);
        })
    }
    handleLocalidad(){
        const localidadInputCompEl = document.querySelector("#localidad-input");
        const localidadInputEl = localidadInputCompEl.querySelector("input");
        localidadInputEl.addEventListener("change", async (e) => {
            state.listeners = [];
            const cs = state.getState();
            const event = (e as any);
            const newLocalidad = event.target.value;
            cs.user_localidad = newLocalidad;
            this.user_localidad = newLocalidad;
            await state.setState(cs);
        })
    }
    handleSave(){
        const saveBtn = document.querySelector("#save-button");
        saveBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            // state.listeners = [];
            await state.changeUserInfo();
            alert("Info del user guardada exitosamente")
        })
    }
});