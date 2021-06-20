import { createControlComponent } from '@react-leaflet/core'
import Leaflet from 'leaflet'
import "leaflet-routing-machine";

const Routing = (props) => {
    const { driver, destination } = props

    
    let routing = Leaflet.Routing.control(
        {
            waypoints: [
                Leaflet.latLng(parseFloat(driver.lat), parseFloat(driver.long)),
                Leaflet.latLng(parseFloat(destination.lat), parseFloat(destination.long)),
            ],
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }]
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            fitSelectedRoutes: true,
            showAlternatives: false,
            itineraryBuilder:false,
            itineraryClassName:'hidden',
            alternativeClassName:'hidden'

        }
    )

    // if(newDest){
    //     console.log(Leaflet.latLng(newDest.lat,newDest.long))
    //     // routing.spliceWaypoints(1,1,Leaflet.latLng(parseFloat(newDest.lat),parseFloat(newDest.long)))
    //     routing.setWaypoints([Leaflet.latLng(parseFloat(driver.lat), parseFloat(driver.long)),Leaflet.latLng(parseFloat(newDest.lat),parseFloat(newDest.long))])
    //     console.log(routing.getWaypoints())
        
    // }

    return routing

}

const RoutingMachine = createControlComponent(Routing);

export {RoutingMachine,Routing}