customElements.define("my-subtitle", class extends HTMLElement {
    text: string;
    type;
    constructor(){
        super();
        this.type = this.getAttribute("type");
    }
    connectedCallback(){
        this.render();
        this.manageStyle();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .subtitle {
                font-family: "Roboto", sans-serif;
                font-weight: 400;
                font-size: 24px;
                line-height: 36px;
                text-align: center;
            }
        `;
        this.appendChild(style);

    }
    render(){
        this.innerHTML = `<h2 class="subtitle">${this.innerText}</h2>`;
    }
    manageStyle(){
        if (this.type == "bold"){
            const subtitleEl = this.querySelector(".subtitle");
            (subtitleEl as any).style.fontWeight = "700";
        }
    }
});