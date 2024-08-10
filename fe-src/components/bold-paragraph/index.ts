customElements.define("my-bold-paragraph", class extends HTMLElement {
    text: string;
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .bold-paragraph {
                font-family: "Roboto", sans-serif;
                font-weight: 700;
                font-size: 16px;
                line-height: 18.75px;
                text-align: center;
            }
        `;
        this.appendChild(style);

    }
    render(){
        this.innerHTML = `<p class="bold-paragraph">${this.innerText}</p>`;
    }
});