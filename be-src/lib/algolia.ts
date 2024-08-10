const algoliasearch = require("algoliasearch");

const client = algoliasearch(process.env.ALGOLIA_USER, process.env.ALGOLIA_KEY);

const lostPetsCollection = client.initIndex('reported_pets')
const record = { 
    objectID: 1, 
    nombre: 'Pet de prueba',
    price: 850,
    _geoloc: {
        lat: 40.639751,
        lng: -73.778925
    }
}
lostPetsCollection.saveObject(record).wait();

export {lostPetsCollection};