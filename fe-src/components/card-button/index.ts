customElements.define("card-button", class extends HTMLElement {
    buttonColor;
    constructor(){
        super();
        // blue, green, red y black
        this.buttonColor = this.getAttribute("buttonColor");
    };
    connectedCallback(){
        this.render();
        this.manageColor();
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
            .button {
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

            .button:hover{
                cursor: pointer;
            }
        `;
        this.appendChild(style);
    };
    render(){
        this.innerHTML = `
            <button class="button" buttonColor="${this.buttonColor}">${this.innerHTML}</button>
        `
    }
    manageColor(){
        const colorMap = {
            blue: "#5A8FEC",
            red: "#EB6372",
        };
        const color = this.getAttribute("buttonColor");
        const buttonElement = this.querySelector(".button");
        if (color && colorMap[color] && buttonElement) {
            (buttonElement as any).style.backgroundColor = colorMap[color];
        }
    }
});