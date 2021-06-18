import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { gql, useQuery, useSubscription } from '@apollo/client'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'
import Button from '../components/Button'
import RoutingMachine from '../components/Routing'

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

const subsOrder = gql`
subscription{
  orderUpdated(where:{status:READY_PICKUP}){
    subtotal
    id
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
    items{
      food{
        name
        image
      }
    }
    createdBy{
      address{
        fullAddress
        longitude
        latitude
      }
    }
  }
}
  `

const Map = () => {
  const { loading, error, data } = useQuery(queryUser)
  const {loading:subsLoading,error:subsError,data:subsData} = useSubscription(subsOrder, { fetchPolicy: 'network-only' })
  const [modal, setModal] = useState(false)
  const [destination, setDestination] = useState(null)
  const [queue, setQueue] = useState([])

  const handlePickUp = (address) => {
    setDestination({ lat: address.latitude, long: address.longitude })
    setModal(false)
    setQueue([])
  }

  useEffect(() => {
    const storeData = () => {
      const helpArray = queue
      if (!subsLoading && !subsError) {
        if(subsData.orderUpdated){
          helpArray.push(subsData.orderUpdated)
          setQueue(helpArray.map(value=>value))
          setModal(true)
        }
      }
    }
    storeData()
    return () => {
      setQueue()
    };
  }, [subsData?.orderUpdated, subsLoading,subsError]);

  if (loading && subsLoading) {
    return <Loading />
  }
  if (error && subsError) {
    return <Error />
  }
  const { address } = data.user.driver.theDriver

  return (
    <React.Fragment>
      {(queue.length>0 && modal) && (
        <div className={'absolute z-20 top-0 flex md:m-auto justify-center flex-col bg-black bg-opacity-50 flex-wrap overflow-y-scroll h-screen md:w-1/2 w-screen'}>
          {
            queue.map((value) => (

              <div key={value.id} className={'p-3 border bg-white rounded-lg m-2 min-w-min w-80'}>
                <div>
                  <h1 className={'text-green-600 text-2xl text-center'}>Order Request</h1>
                </div>
                <div>
                  <p className={'text-center text-lg'}>{value.merchant.name}</p>
                  <div className={'flex w-full'}>
                    <img alt={value.items[0].food.name} src={value.items[0].food.image} className={'w-20 rounded-lg'} />
                    <div className={'px-3'}>
                      <p>Food : <span className={'text-green-600'}>{value.items[0].food.name}</span></p>
                      <p>Price : <span className={'text-green-600'}>Rp {value.subtotal}</span></p>
                      <p>Location : <span className={'text-green-600'}>{value.merchant.owner.address.fullAddress}</span></p>
                    </div>
                  </div>
                  <div className={'py-3'}>
                    <p>Delivery to : <span className={'text-green-600'}>{value.createdBy.address.fullAddress}</span></p>
                  </div>
                </div>
                <div className={'flex flex-1 w-full justify-between'}>
                  <div>
                    <Button title={'Pick Up'} onClick={() => handlePickUp(value.merchant.owner.address)} />
                  </div>
                  {/* <div>
                    <Button title={'Reject'} color={'red'} onClick={() => handleReject(value.id)} />
                  </div> */}
                </div>
              </div>
            ))
          }
        </div>
      )}
      <MapContainer center={[parseFloat(address.latitude), parseFloat(address.longitude)]} zoom={14} className={'h-full z-0'} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destination ? (
          <RoutingMachine driver={{ lat: address.latitude, long: address.longitude }} destination={{ lat: destination.lat, long: destination.long }} />

        ) : (
          <Marker position={[address.latitude, address.longitude]}>
            <Popup>
              Your location.
            </Popup>
          </Marker>

        )}
      </MapContainer>
    </React.Fragment>
  )
}

export default Map