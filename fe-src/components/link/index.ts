customElements.define("my-link", class extends HTMLElement {
    text: string;
    href;
    constructor(){
        super();
        this.href = this.getAttribute("href");
    }
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

            .link {
                font-family: "Roboto", sans-serif;
                font-weight: 500;
                font-size: 16px;
                line-height: 18.75px;
                color: #3B97D3;
            }
        `;
        this.appendChild(style);

    }
    render(){
        this.innerHTML = `<a href="${this.href}" class="link">${this.innerText}`;
    }
});