
// for initializing the socket
const socket = io() ;

// console.log("hey") ;

// cheking that the browzer supports geolocation

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude , longitude} = position.coords
        socket.emit("send-location" , {latitude , longitude}) ;
    } , (error) => {
        console.error(error) ;
    } ,

    // settings -> high accuracy , timeout , maximumage
    {
        enableHighAccuracy : true ,
        // check after 5 sec
        timeout: 5000 ,  
        maximumAge: 0 ,
    }) ;
}

L.map("map").setView([0 , 0],16) ;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {} ;

// this part gaves nearby location
socket.on("recieve-location" , (data) => {
    const {id , latitude , longitude} = data ;
    map.setView([latitude , longitude] , 16) ;

    if(markers[id])
    {
        markers[id].setLatLng([latitude , longitude]) ;
    }
    else
    {
        markers[id] = L.markers([latitude , longitude]).addTo(map) ;
    }
}) ;

socket.on("user-disconnect" , (id) => {
    if(markers[id])
    {
        map.removeLayer(markers[id]) ;
        delete markers[id] ;
    }
} ) ;