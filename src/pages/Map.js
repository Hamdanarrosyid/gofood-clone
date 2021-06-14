import React from 'react'
import Container from '../components/layouts/Container'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { gql, useQuery } from '@apollo/client'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'

const Map = () => {
    const queryUser = gql`
    query{
        user{
          id
          email
          driver{
            theDriver{
              id
              firstName
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
    const {loading,error,data} = useQuery(queryUser)

    if(loading){
        return <Loading/>
    }
    if(error){
        return <Error/>
    }
    const {address} = data.user.driver.theDriver
    return (
        // <Container padding={false} role={'driver'}>
                <MapContainer center={[address.latitude, address.longitude]} scrollWheelZoom={false} zoom={18} className={'h-full'} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[address.latitude, address.longitude]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
        // </Container>
    )
}

export default Map