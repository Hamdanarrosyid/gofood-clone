import React, { useEffect } from 'react'
import { useLeafletContext, createControlComponent } from '@react-leaflet/core'
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

    return routing

}

const RoutingMachine = createControlComponent(Routing);

export default RoutingMachine