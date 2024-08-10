customElements.define("my-label", class extends HTMLElement {
    text: string;
    for;
    constructor(){
        super();
        this.for = this.getAttribute("for");
    }
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .label {
                font-family: "Poppins", sans-serif;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
            }
        `;
        this.appendChild(style);

    }
    render(){
        this.innerHTML = `<label for="${this.for}" class="label">${this.innerText}</label>`;
    }
});