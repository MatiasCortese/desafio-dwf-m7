export function getUserLocation(){
    return new Promise ((resolve, reject) => {
        const _geoloc = {};
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                _geoloc["lat"] = position.coords.latitude,
                _geoloc["lng"] = position.coords.longitude;
                resolve(_geoloc);
                return _geoloc;
            }, (error) => {
                console.error(`Error al obtener la ubicación: ${error.message}`);
            })
        } else {
            console.error("La geolocalización no es soportada por este navegador.");
            reject(new Error("Geolocalización no soportada"));
        }
    });
}