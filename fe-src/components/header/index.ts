import { Router } from "@vaadin/router";
import { state } from "../../state";
import { header } from "express-validator";

customElements.define("my-header", class extends HTMLElement {
    iconUrl;
    userEmail;
    constructor(){
        super();
        this.iconUrl = require("url:../../images/pet-finder-icon.png")
        this.userEmail = "matute@apx.com";
    };
    connectedCallback(){
        this.render();
        this.addStyle();
        this.manageMenu();
        this.manageClosingExpandedMenu();
        this.handleHomeBtn();
        this.manageLinks();
    };
    render(){
        this.innerHTML = `
        <header class="header">
            <img id="header-icon" src=${this.iconUrl}>
            <div class="hamburger" id="hamburger">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        </header>
        <div class="menu-expanded hidden">
            <div class="close-menu">X</div>
            <a class="links-header" id="me-link">Mis datos</a>
            <a class="links-header" id="my-pets-link">Mis mascotas reportadas</a>
            <a class="links-header" id="report-link">Reportar mascota</a>
            <div class="menu_user-data">
                <div class="user-email">${this.userEmail}</div>
                <a class="link-logout" href="/home">CERRAR SESIÓN</a>
            </div>
        </div>
        `
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            .header {
                height: 60px;
                border-radius: 0 0 10px 10px;
                background-color: #26302E;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px 0 20px;
                
            }
                
            #header-icon {
                width: 40px;
                height: 40px;
            }

            #header-icon, #me-link, #my-pets-link, #report-link, :hover {
                cursor: pointer;
            }

            .hamburger {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 24px;
                height: 24px;
            }

            .bar {
                height: 2px;
                width: 100%;
                border-radius: 2px;
                background-color: #FFFFFF;
            }

            .menu-expanded {
                background-color: #26302E;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                 position: fixed; /* Cambia de absolute a fixed */
                top: 0; /* Asegúrate de que esté en la parte superior */
                left: 0; /* Asegúrate de que esté alineado a la izquierda */
                z-index: 1000; /* Ajusta el valor según sea necesario */
            }

            .close-menu {
                color: #EEEEEE;
                font-weight: 700;
                font-family: "Poppins", sans-serif;
                font-size: 24px;
                align-self: flex-end;
                padding: 0 25px 129px 0;
            }

            .close-menu:hover {
                cursor: pointer;
                
            }

            .links-header {
                font-weight: 700;
                font-family: "Poppins", sans-serif;
                font-size: 24px;
                line-height: 36px;
                text-align: center;
                color: #EEEEEE;
                text-decoration: none;
                padding-top: 80px;
            }

            .menu_user-data {
                padding-top: 147px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .user-email {
                font-family: "Poppins", sans-serif;
                color: #EEEEEE;
            }

            .link-logout {
                font-family: "Poppins", sans-serif;
                margin-top: 17px;
                color: #3B97D3;
                justify-self: center;
            }

            .hidden {
                display: none;
            }
        `;
        this.appendChild(style);
    }
    manageMenu(){
        const menuEl = this.querySelector(".hamburger");
        if(menuEl){
            menuEl.addEventListener("click", () => {
                const headerEl = this.querySelector(".header");
                const expandedMenuEl = this.querySelector(".menu-expanded");
                if(headerEl && expandedMenuEl){
                    headerEl.classList.toggle("hidden");
                    expandedMenuEl.classList.toggle("hidden");
                }
            });
        }
    }
    manageClosingExpandedMenu(){
        const closeBtnEl = this.querySelector(".close-menu");
        if(closeBtnEl){
            closeBtnEl.addEventListener("click", () => {
                const expandedMenuEl = this.querySelector(".menu-expanded");
                const headerEl = this.querySelector(".header");
                if(expandedMenuEl && headerEl){
                    expandedMenuEl.classList.toggle("hidden");
                    headerEl.classList.toggle("hidden");
                }
            });
        }
    }
    handleHomeBtn(){
        this.querySelector("#header-icon").addEventListener("click", () => {
            Router.go("/home");
        })
    };
    manageLinks(){
        const misDatosLink = this.querySelector("#me-link");
        const myPetsLink = this.querySelector("#my-pets-link");
        const reportarLink = this.querySelector("#report-link");
        misDatosLink.addEventListener("click", ()=>{
            Router.go("/me");
        });
        myPetsLink.addEventListener("click", ()=>{
            Router.go("/me/report");
        });
        reportarLink.addEventListener("click", ()=>{
            Router.go("/report");
        });

    }
});