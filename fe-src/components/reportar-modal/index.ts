import "../title";
import "../button";

customElements.define("my-modal", class extends HTMLElement {
    petName: string;
    nombre: string;
    telefono: number;
    message: string;
    buttonColor;
    constructor(){
        super();
        this.buttonColor = this.getAttribute("buttonColor");
        this.petName = this.getAttribute("petname");
    }
    connectedCallback(){
        this.render();
        this.manageStyle();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .modal {
                width: 286px;
                height: 575px;
                border-radius: 10px;
                background-color: #26302E;
                padding: 14px 18px 18px 18px;
            }

            .modal-content {
                display: flex;
                flex-direction: column;
                
            }

            .close {
                align-self: flex-end;
                color: #FFFFFF;
                font-size: 24px;
            }
            
            .close:hover {
                cursor: pointer;
            }

            .form-title {
                color: #FFFFFF;
            }

            #contactForm {
                display: flex;
                flex-direction: column;
                font-family: "Poppins", sans-serif;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
                color: #FFFFFF;
            }
            
            .input {
                width: 275px;
                height: 50px;
                background-color: #4A5553;
                color: #FFFFFF;
                font-size: 16px;
                margin-bottom: 25px;
            }

            .subtitle {
                font-family: "Roboto", sans-serif;
                font-weight: 400;
                font-size: 24px;
                line-height: 36px;
                text-align: center;
            }

            .submit-button {
                width: 100%;
            }
        `;
        this.appendChild(style);
    }
    render(){
        this.innerHTML = `
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <my-title class="form-title">Reportar info de ${this.petName}</my-title>
                    <form id="contactForm">
                        <label for="name">NOMBRE</label>
                        <input class="input" type="text" id="name" name="name" required>

                        <label for="phone">TELÉFONO</label>
                        <input class="input" type="phone" id="phone" name="phone" required>

                        <label for="message">¿DÓNDE LO VISTE?</label>
                        <textarea class="input" id="message" name="message" required></textarea>

                        <my-button buttonColor="${this.buttonColor}" class="submit-button" type="submit">Enviar información</my-button>
                    </form>
                </div>
            </div>
        `;
    }
    manageStyle(){
        (this.querySelector(".submit-button").querySelector(".button") as any).style.width =  "276px";
    }
});