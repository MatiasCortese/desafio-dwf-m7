import "../../components/button";
import "../../components/card-button";

customElements.define("pet-card", class extends HTMLElement {
    petName;
    petImg;
    petVistaEn;
    buttonColor;
    constructor(){
        super();
        this.petImg; 
        this.petName;
        this.petVistaEn;
        this.buttonColor = this.getAttribute("buttonColor");
    }
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .pet-card {
                width: 335px;
                height: 234px;
                border-radius: 10px;
                font-family: "Poppins", sans-serif;
                border: 1px solid black;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
                text-align: center;
                background-color: #26302E;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 35px;
            }

            .pet-img{
                width: 320px;
                height: 136px;
                margin-top: 9px;
                border-radius: 3px;
            }

            .info-container {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-evenly;
                align-items: center;
            }

            .info {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }

            .pet-name {
                font-family: "Poppins", sans-serif;
                font-weight: 700;
                font-size: 36px;
                line-height: 54px;
                color: #FFFFFF;
            }

            .pet-location {
                font-size: 16px;
                line-height: 18.75px;
            }

            .action-button {
                width: 100px;
                height: 40px;
                border-radius: 4px;
                color: #FFFFFF;
                font-family: "Poppins", sans-serif;
                font-weight: 400;
                font-size: 16px;
                line-height: 18.75px;
                border: none;
            }

            .edit {
                background-color: #5A8FEC;
            }

            .button-container{
                width: 120px;
            }
        `;
        this.appendChild(style);
    }
    render(){
        this.petImg = this.getAttribute("imageUrl");
        this.petName = this.getAttribute("petName");
        this.petVistaEn = this.getAttribute("petVistaEn");
        this.innerHTML = `
        <div class="pet-card">
            <div>
                <img class="pet-img" src="${this.petImg}">
            </div>
            <div class="info-container">
                <div class="info">
                    <div class="pet-name">${this.petName}</div>
                    <div class="pet-name pet-location">${this.petVistaEn}</div>
                </div>
                <div class="button-container">
                    <card-button buttonColor="${this.buttonColor}" id="report-button">${this.innerHTML}</card-button>
                </div>
            </div>
        </div>`;
    }
    manageButton(cb){
        this.querySelector("#report-button").addEventListener("click", ()=>{
            
            // ver acá como desplegar modal al clickearse
        })
    }
});