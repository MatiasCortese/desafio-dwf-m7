import "../../components/header";
import "../../components/button";
import "../../components/title";
import "../../components/subtitle";
import "../../components/paragraph";
import "../../components/bold-paragraph";
import "../../components/label";
import "../../components/link";
import "../../components/input";
import "../../components/pet-card";
import { state } from "../../state";
import mapboxgl from "mapbox-gl";
const {Dropzone} = require("dropzone");
import { Router } from "@vaadin/router";

// mover al env
const AT =  "pk.eyJ1IjoibWF0aWNvcnRlc2UiLCJhIjoiY2x1MW9hY3cyMGdxMTJqbzZ4Y3M2Zjk3dCJ9.9Xz4c-NXiUg_v0BkGqBWxg";
mapboxgl.accessToken = AT;

customElements.define("report-page", class extends HTMLElement {
    petName;
    petFotoURL;
    pet_vista_en;
    pet_last_location_lng;
    pet_last_location_lat;
    pet_estado;
    map;
    dropzoneBgImg;
    myDropzone;
    petEstado;
    constructor(){
        super();
        const cs = state.getState();
        if (cs.userId == "") {
            Router.go("/auth");
        }
        this.petName = "";
        this.petFotoURL = "";
        this.pet_vista_en = "";
        this.pet_last_location_lng;
        this.pet_last_location_lat;
        this.petEstado;
        this.dropzoneBgImg = require("url:../../images/image7.png")
        Dropzone.autoDiscover = false;
        this.myDropzone;
        this.map;
    };
    async connectedCallback(){
        this.render();
        this.addStyle();
        this.getPetName();
        this.manageDropzone();
        this.initMap();
        this.buscarDir();
        this.changeDropZoneImg();
        this.handleFormSubmit();

    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Reportar mascota</my-title>
                <my-paragraph class="my-subtitle">Ingresá la siguiente información para realizar el reporte de la mascota
                </my-paragraph>
                <div id="form">
                    <my-label for="nombre" type="nombre">
                        NOMBRE
                    </my-label>
                    <my-input type="nombre" name="nombre" class="petname"></my-input>
                    <div id="dropzone"></div>
                    <my-button type="" buttonColor="blue" class="agregar-foto">
                        Agregar foto
                    </my-button>
                    <my-button type="" buttonColor="blue" class="modificar-foto hidden">
                        Modificar foto
                    </my-button>
                    <div id="map"></div>
                    <input class="my-input q" name="q" type="search">
                    <button class="button blue" id="search-form-button">Buscar</button>
                    <my-paragraph id="search-box-message">
                        Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.
                    </my-paragraph>
                    <div name="ubicacion" id="searchbox-container"></div>
                    <my-button id="submitBtn" buttonColor="green" class="button">
                        Reportar mascota
                    </my-button>
                    <my-button type="cancelar" buttonColor="black" class="button">
                        Cancelar
                    </my-button>
                </div>
            </div>
        `
    }
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
            .container {
                padding: 50px 85px 80px 75px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
                background-color: #DEF4F0;
                height: auto;
            }

            .img {
                width: 340.3px;
                height: 205px;
            }

            .title {
                font-size: 36px;
                color: #000000;
                font-weight: 700;
                font-size: 36px;
                line-height: 54px;
            }

            .blue {
                background-color: rgb(90, 143, 236);
            }

            .my-subtitle {
                font-weight: 400px;
                font-size: 16px;
                line-height: 18.75px;
                font-family: "Roboto", sans-serif;
            }

            .button {
                margin-top: 25px;
                width: 100%;
            }
            
            .register-container {
                display: flex;
                align-items: center;
                gap: 5px;
                justify-content: center;
            }

            #dropzone {
                width: 335px;
                height: 180px;
                border-radius: 10px;
                background-image: url(${this.dropzoneBgImg});
            }

            #map {
                margin: 55.5px 0 60px 0px;
                width: 333.97px;
                height: 320px;
                border-radius: 10px;
            }

            .my-input{
                width:335px;
                height: 60px;
                border:none;
                border-radius:7px;
            }

            .buscar-ubi {
                background-color: #58D665;
                width: 335px;
                height: 50px;
                border: none;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                transition: transform 0.2s;
                margin:20px 0;
            }
        `;
        this.appendChild(style);
    }
    getPetName(){
        const petNameInputEl = this.querySelector(".petname");
        petNameInputEl.addEventListener("change", (e) => {
            e.preventDefault();
            this.petName = (e.target as any).value;
        })
    }
    manageDropzone(){
        this.myDropzone = new Dropzone("#dropzone", {
            url: "/falsa",
            autoProcessQueue: false,
            clickable: ['#dropzone', '.agregar-foto']
        });
        this.myDropzone.on("thumbnail", file => {
            const imgElement = file.previewElement.querySelector("[data-dz-thumbnail]");
            const agregarFotoBtnEl = document.querySelector(".agregar-foto");
            const modificarFotoBtnEl = document.querySelector(".modificar-foto");
            agregarFotoBtnEl.classList.toggle("hidden");
            modificarFotoBtnEl.classList.toggle("hidden");
            const dzDetails = document.querySelector(".dz-details");
            const dzProgress = document.querySelector(".dz-progress");
            const dzErrorMessage = document.querySelector(".dz-error-message");
            const dzSuccessMark = document.querySelector(".dz-success-mark");
            const dzErrorMark = document.querySelector(".dz-error-mark");
            [dzDetails, dzProgress, dzErrorMessage,dzSuccessMark, dzErrorMark].forEach(i => {
                i.classList.toggle("hidden");
            })
            imgElement.style.display = "block"; // Muestra la imagen
            imgElement.style.width = "335px"; // Ajusta el ancho al 100% del contenedor
            imgElement.style.height = "180px"; // Altura automática para mantener la proporción
            imgElement.style.objectFit = "cover"; // Ajusta la imagen para cubrir todo el contenedor
            imgElement.style.borderRadius = "10px"; // Opcional: bordes redondeados
            this.petFotoURL = file.dataURL;
        });
    }
    changeDropZoneImg(){
        const modificarImgBtnEl = document.querySelector(".modificar-foto");
        modificarImgBtnEl.addEventListener("click", ()=> {
            const subirImgBtnEl = document.querySelector(".agregar-foto");
            if (this.myDropzone.files.length > 0) {
                modificarImgBtnEl.classList.toggle("hidden");
                subirImgBtnEl.classList.toggle("hidden");
                this.myDropzone.removeFile(this.myDropzone.files[0]); // Elimina el primer archivo (el actual)
            }
        })
    }
    initMap(){
        const mapContainer = document.querySelector("#map");
        mapboxgl.accessToken = AT;
        this.map = new mapboxgl.Map({
            container: mapContainer,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-58.381775, -34.603851], // Coordenadas del Obelisco en Buenos Aires long-lat
            zoom: 0,
            maxBounds: [
                [-75, -55], // Esquina suroeste de Argentina
                [-53, -20], // Esquina noreste de Argentina
            ],
        });
    }
    initSearchForm(query: string){
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${AT}`
        )
        .then((resp) => resp.json())
        .then((data) => {
            const [longitude, latitude] = data.features[0].center;
            const placeName = data.features[0].place_name;
            const nameUbicacionPet = placeName.split(" ").slice(0, 4).join(" ");
            const nameUbicacion = nameUbicacionPet.split(",").join("");
            this.pet_vista_en = nameUbicacion;
            this.map.flyTo({ center: [longitude, latitude], zoom: 15 });
            this.map.on("click", (e) => {
                const { lng, lat } = e.lngLat;
                this.pet_last_location_lng = lng;
                this.pet_last_location_lat = lat;
                // Eliminar marcadores existentes (si los hay)
                if (this.map.getLayer("marker")) {
                    this.map.removeLayer("marker");
                    this.map.removeSource("marker");
                }
                // Agregar marcador en la ubicación seleccionada
                this.map.addSource("marker", {
                    type: "geojson",
                    data: {
                    type: "FeatureCollection",
                    features: [
                        {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [lng, lat],
                        },
                        },
                    ],
                    },
                });
            this.map.addLayer({
                id: "marker",
                type: "symbol",
                source: "marker",
                layout: {
                    "icon-image": "marker", // Cambia esto por el icono que desees
                    "icon-size": 1,
                },
            });
            });
        })
        .catch((error) => {
            console.error("Error al realizar la búsqueda:", error);
        });
    }
    buscarDir() {
        const searchFormButtonEl = this.querySelector("#search-form-button") as HTMLFormElement;
        searchFormButtonEl.addEventListener("click", (e) => {
            e.preventDefault();
            const inputEl = this.querySelector(".my-input");
            const inputValueForSearch = (inputEl as any).value;
            if (inputValueForSearch) {
                const query = inputValueForSearch;
                if (query.trim() !== "") {
                    this.initSearchForm(query);
                }
            }
        });
    }
    handleFormSubmit(){
        const submitBtnEl = document.querySelector("#submitBtn");
        submitBtnEl.addEventListener("click", async (e) => {
            e.preventDefault();
            if (this.petName == "" || this.petFotoURL == "" || this.pet_last_location_lat || this.pet_last_location_lng){
                const cs = await state.getState();
                cs.pet_vista_en = this.pet_vista_en;
                cs.petName = this.petName;
                cs.petFotoURL = this.petFotoURL;
                cs.pet_last_location_lat = this.pet_last_location_lat;
                cs.pet_last_location_lng = this.pet_last_location_lng;
                await state.setState(cs);
                await state.createLostPetReport();
                alert(`Pet ${cs.petName} creada exitosamente`)
                Router.go("/me/report")
            } else {
                console.log("falta algún dato")
            }
        })
    }
    
});

// la lógica sería obtener la data a medida que se completa e ir guardándola en el componente. Una vez que se clickea el "submit" hacer un getState y pasarle la data al state, y posteriormente ya fue enviada, ejecutar la función del state que crea el reporte