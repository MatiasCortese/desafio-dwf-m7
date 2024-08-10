customElements.define("my-input", class extends HTMLElement {
    dark;
    type;
    previousinfo;
    constructor(){
        super();
        this.dark = this.getAttribute("dark");
        this.type = this.getAttribute("type");
        this.previousinfo = this.getAttribute("previousinfo") || "";
    }
    connectedCallback(){
        this.render();
        this.manageDarkness();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

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
    render(){
        this.innerHTML = `<input type="${this.type}" dark="${this.dark}" class="input" value="${this.previousinfo}">`;
    }
    manageDarkness(){
        if(this.dark == "true"){
            (this.querySelector(".input") as any).style
            .backgroundColor = "#4A5553";
            (this.querySelector(".input") as any).style.color = "#FFFFFF";
        }
    }
});