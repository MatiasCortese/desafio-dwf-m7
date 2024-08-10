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
import mapboxgl from "mapbox-gl";
import { state } from "../../state";
const {Dropzone} = require("dropzone");
import { Router } from "@vaadin/router";

const AT =  "pk.eyJ1IjoibWF0aWNvcnRlc2UiLCJhIjoiY2x1MW9hY3cyMGdxMTJqbzZ4Y3M2Zjk3dCJ9.9Xz4c-NXiUg_v0BkGqBWxg";
mapboxgl.accessToken = AT;

customElements.define("report-edit-page", class extends HTMLElement {
    petId;
    petName;
    pet_vista_en;
    pet_last_location_lat;
    pet_last_location_lng;
    petFotoURL;
    reportId;
    myDropzone;
    map;
    estado;
    constructor(){
        super();
        const cs = state.getState();
        this.petId = cs.petId;
        this.petName = cs.petName;
        this.pet_vista_en = cs.pet_vista_en;
        this.petFotoURL = cs.petFotoURL;
        this.estado = cs.pet_estado;
        this.myDropzone;
        this.map;
    };
    connectedCallback(){
        console.log(this.estado)
        state.removeListeners();
        state.subscribe(()=>{
            this.render();
            this.addStyle();
            this.manageDropzone();
            this.initMap();
            this.buscarDir();
            this.changeDropZoneImg();
            this.handleSave();
        });
        this.render();
        this.addStyle();
        this.manageDropzone();
        this.initMap();
        this.buscarDir();
        this.handlePetNameInput();
        this.changeDropZoneImg();
        this.handleSave();
        this.reportarComoEncontrado();
        this.handleCancelReport();
        this.handleConfirmPetFound();
        this.deletePet();
        this.handleCancelDelete();
        this.handleConfirmDelete();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title class="home-title black">Editar reporte de mascota</my-title>
                <div class="form">
                    <my-label for="nombre" type="nombre">
                        NOMBRE
                    </my-label>
                    <my-input previousinfo="${this.petName}" id="petNameInput" name="nombre"></my-input>
                    <img id="dropzone" src="${this.petFotoURL}">
                    <my-button type="" buttonColor="blue" class="modificar-foto">
                        Modificar foto
                    </my-button>
                    <div class="map" id="map"></div>
                    <my-input class="my-input q" name="q" type="search" previousinfo="${this.pet_vista_en}"></my-input>
                    <button class="button blue" id="search-form-button">Buscar</button>
                    <my-paragraph>
                        Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.
                    </my-paragraph>
                    <my-button id="save-btn" type="cancelar" buttonColor="blue" class="button">
                        Guardar
                    </my-button>
                    <my-button type="" buttonColor="green" class="button" id="reportar-encontrado">
                        Reportar como encontrado
                    </my-button>
                    <my-button id="eliminar-reporte-btn" type="cancelar" buttonColor="red" class="button">
                        Eliminar reporte
                    </my-button>
                </div>
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <h2>¿Estás seguro?</h2>
                        <p>Estás a punto de reportar esta mascota como encontrada. Esta acción no se puede deshacer. ¿Deseas continuar?</p>
                        <div class="button-group">
                            <button class="cancel-btn">Cancelar</button>
                            <button class="confirm-btn">Confirmar</button>
                        </div>
                    </div>
                </div>
                <div id="myModalEliminar" class="modal">
                    <div class="modal-content">
                        <h2>¿Estás seguro?</h2>
                        <p>Estás a punto de eliminar esta mascota. Esta acción no se puede deshacer. ¿Deseas continuar?</p>
                        <div class="button-group">
                            <button id="cancelar-delete" class="cancel-btn">Cancelar</button>
                            <button id="confirmar-delete" class="confirm-btn">Confirmar</button>
                        </div>
                    </div>
                </div>
        `
    };
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
            }

            .blue {
                background-color: rgb(90, 143, 236);
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
                background-color: grey;
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

            .modal {
            display: none; /* Oculto por defecto */
            font-family: "Poppins", sans-serif;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            text-align: center;
        }
            
        .button-group {
            margin-top: 20px;
        }

        .button-group button {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            cursor: pointer;
        }

        .cancel-btn {
            background-color: rgb(235, 99, 114);
            color: white;
        }
        
        .confirm-btn {
            background-color: rgb(0, 168, 132);
            color: white;
        }

        .show {
            display: block
        }
        `;
        this.appendChild(style);
    }
    manageDropzone(){
        this.myDropzone = new Dropzone("#dropzone", {
            url: "/falsa",
            autoProcessQueue: false,
            clickable: ['#dropzone', '.modificar-foto']
        });
        this.myDropzone.on("thumbnail", async file => {
            const cs = state.getState();
            const imgElement = file.previewElement.querySelector("[data-dz-thumbnail]");
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
            cs.petFotoURL = this.petFotoURL;
            state.setState(cs);
        });
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
    changeDropZoneImg(){
        const modificarImgBtnEl = document.querySelector(".modificar-foto");
        modificarImgBtnEl.addEventListener("click", ()=> {
            const subirImgBtnEl = document.querySelector(".modificar-foto");
            if (this.myDropzone.files.length > 0) {
                modificarImgBtnEl.classList.toggle("hidden");
                subirImgBtnEl.classList.toggle("hidden");
                this.myDropzone.removeFile(this.myDropzone.files[0]); // Elimina el primer 
            }
        })
    }
    handlePetNameInput(){
        const petNameInputEl = document.querySelector("#petNameInput");
        const petNameInput = petNameInputEl.querySelector("input");
        petNameInput.addEventListener("change", async (e) => {
            const cs = state.getState();
            const event = (e as any);
            const petNewName = event.target.value;
            cs.petName = petNewName;
            this.petName = petNewName;
            await state.setState(cs);
        })
    }
    initSearchForm(query: string){
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${AT}`
        )
        .then((resp) => resp.json())
        .then((data) => {
            const cs = state.getState();
            const [longitude, latitude] = data.features[0].center;
            const placeName = data.features[0].place_name;
            const nameUbicacionPet = placeName.split(" ").slice(0, 4).join(" ");
            const nameUbicacion = nameUbicacionPet.split(",").join("");
            this.pet_vista_en = nameUbicacion;
            cs.pet_vista_en = this.pet_vista_en;
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
            state.setState(cs);
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
            const inputValueForSearch = (inputEl as any).querySelector("input").value;
            if (inputValueForSearch) {
                const query = inputValueForSearch;
                if (query.trim() !== "") {
                    this.initSearchForm(query);
                }
            }
        });
    }
    async handleSave(){
            // pensemos que el componente tiene la información cuando se clickea este button. Sea la original o modificada.
            // Qué debiera entonces hacer este método? Llamar a un método del state que cambie la info de la pet en la db? Pues seguramente
            const saveBtnEl = document.querySelector("#save-btn");
            saveBtnEl.addEventListener("click", async (e) => {
                e.preventDefault();
                // lo limpiamos para que no se haga bardo
                state.listeners = [];
                await state.changePetInfo();
        })
    }
    async reportarComoEncontrado(){
        const reportarBtnEl = document.querySelector("#reportar-encontrado")
        const confirmReportModal = document.querySelector(".modal")
        reportarBtnEl.addEventListener("click", () => {
            (confirmReportModal as any).classList.toggle("show");
        })
    }
    async handleCancelReport(){
        const cancelReportBtnEl = document.querySelector(".cancel-btn");
        const confirmReportModal = document.querySelector(".modal")
        cancelReportBtnEl.addEventListener("click", () => {
            (confirmReportModal as any).classList.toggle("show");
        });
    }
    async handleConfirmPetFound(){
        const confirmBtnEl = document.querySelector(".confirm-btn");
        confirmBtnEl.addEventListener("click", async () => {
            const cs = await state.getState();
            if(this.estado != "perdido") {
                alert("Esta mascota no está perdida")
                Router.go("/me/report")
            }
            if(this.estado == "perdido") {
                this.estado = "encontrado";
                cs.pet_estado = "encontrado";
                await state.setPetAsFound();
                alert("Esta mascota se marcó como encontrada. Ya no se mostrará para su búsqueda");
            }
        });
    }
    async deletePet(){
        const deleteBtnEl = document.querySelector("#eliminar-reporte-btn");
        const deleteReportModal = document.querySelector("#myModalEliminar");
        deleteBtnEl.addEventListener("click", () => {
            (deleteReportModal as any).classList.toggle("show");
            // Lanzar función que escuche el modal
        })
    };
    handleCancelDelete(){
        const cancelDeleteBtnEl = document.querySelector("#cancelar-delete");
        const deletePetModal = document.querySelector("#myModalEliminar");
        cancelDeleteBtnEl.addEventListener("click", () => {
            (deletePetModal as any).classList.toggle("show");
        });
    };
    async handleConfirmDelete(){
        const confirmDeleteBtn = document.querySelector("#confirmar-delete");
        confirmDeleteBtn.addEventListener("click", async () => {
            const cs = await state.getState();
            if(!cs.petId) {
                console.log("No hay una pet para eliminar");
            }
            if(cs.petId){
                await state.deletePet();
                alert(`Pet ${cs.petName} eliminada exitosamente`);
                Router.go("/me")
            };
        })
    };
    // crear método que handlea el delete pet con modal para confirmar y llama al método del state
});