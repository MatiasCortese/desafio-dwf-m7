customElements.define("my-button", class extends HTMLElement {
    buttonColor;
    submit;
    constructor(){
        super();
        // blue, green, red y black
        this.buttonColor = this.getAttribute("color");
        this.submit = false;
    };
    connectedCallback(){
        this.render();
        this.manageColor();
        this.isSubmit();
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .button {
                height: 50px;
                font-size: 16px;
                line-height: 18.75px;
                text-align: center;
                font-family: "Roboto", sans-serif;
                font-weight: 700;
                border-radius: 4px;
                border: none;
                color: #FFFFFF;
                width: 100%;
            }

            .button:hover {
                cursor: pointer;
            }
        `;
        this.appendChild(style);
    };
    render(){
        this.innerHTML = `
            <button class="button">${this.innerHTML}</button>
        `
    }
    manageColor(){
        const colorMap = {
            blue: "#5A8FEC",
            green: "#00A884",
            red: "#EB6372",
            black: "#4A5553" 
        };
        const color = this.getAttribute("buttonColor");
        const buttonElement = this.querySelector(".button");
        if (color && colorMap[color] && buttonElement) {
            (buttonElement as any).style.backgroundColor = colorMap[color];
        }
    }
    isSubmit(){
        const submit = this.getAttribute("submit");
        if (submit){
            const buttonElement = this.querySelector(".button");
            buttonElement.setAttribute("type", "submit");
        }
    }
});