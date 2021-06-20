import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Container from '../components/layouts/Container'
import { gql, useMutation, useSubscription } from '@apollo/client'
import Loading from '../components/layouts/Loading'
import Button from '../components/Button'
import {RoutingMachine} from '../components/Routing'
import { useState } from 'react/cjs/react.development'
import { useHistory, useParams } from 'react-router-dom'
import useGeoLocation from '../utils/useGeoLocation'

const orderSubs = gql`
subscription{
    orderUpdated(where:{status:DELIVERING}){
      subtotal
      id
      deliveredBy{
        theDriver{
          address{
            fullAddress
            longitude
            latitude
          }
        }
      }
      merchant{
        name
        owner{
          address{
            fullAddress
            longitude
            latitude
          }
        }
      }
    }
  }
`

const cancelOrderMutation = gql`
mutation($id:String!,$status:OrderStatus!){
    updateOrder(id:$id,input:{status:$status}){
      status
    }
  }
`

const PinLocation = () => {
    const { orderId } = useParams()
    const geoLoc = useGeoLocation()
    const history = useHistory()
    const [driverLocation, setDriverLocation] = useState(null)
    const [updateOrder] = useMutation(cancelOrderMutation)
    const { loading, data, error } = useSubscription(orderSubs)

    const handleCancel = () => {
        updateOrder({ variables: { id: orderId,status: 'CANCELLED' } })
            .then(res => {
                history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (data?.orderUpdated) {
            const { longitude, latitude } = data.orderUpdated.deliveredBy.theDriver.address
            setDriverLocation({ latitude: latitude, longitude: longitude })
        }
    }, [data?.orderUpdated, loading]);

    return (
        <React.Fragment>
            <Container padding={false}>
                {
                    !geoLoc.loaded ? (
                        <Loading />
                    ) :
                        geoLoc.error ? (
                            <p>{geoLoc.message}</p>
                        )
                            : (
                                <div className={'h-full overflow-hidden relative'}>
                                    {loading ? (
                                        <div className={'absolute z-20 h-screen bg-black bg-opacity-50 w-full flex items-center justify-center'}>
                                            <div className={'bg-white shadow-lg rounded-lg p-5'}>
                                                <p className={'text-lg'}>Looking for drivers</p>
                                                <div className={'py-8 text-center items-center flex justify-center'}>
                                                    <p className={'animate-spin text-green-600 font-bold'}>000</p>
                                                </div>
                                                <div>
                                                    <Button color={'red'} onClick={handleCancel} title={'cancel'} />
                                                </div>
                                            </div>
                                        </div>
                                    ):error && (
                                        <p>error</p>
                                    )}
                                    <MapContainer center={[geoLoc.coordinates.lat, geoLoc.coordinates.lng]} className={'h-full z-0'} zoom={14} scrollWheelZoom={false}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            zIndex={100}
                                        />
                                        {driverLocation ? (
                                            <RoutingMachine driver={{ lat: geoLoc.coordinates.lat, long: geoLoc.coordinates.lng }} destination={{ lat: driverLocation.latitude, long: driverLocation.longitude }} />

                                        ) : (
                                            <Marker position={[geoLoc.coordinates.lat, geoLoc.coordinates.lng]}>
                                                <Popup>
                                                    Your location.
                                                </Popup>
                                            </Marker>

                                        )}

                                    </MapContainer>
                                </div>
                            )
                }
            </Container>
        </React.Fragment>
    )
}

export default PinLocation