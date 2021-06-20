import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'
import Button from '../components/Button'
import { RoutingMachine } from '../components/Routing'

const queryUser = gql`
    query{
        user{
          id
          email
          driver{
            id
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

const updateStatusOrder = gql`
mutation($id: String!, $driverId: String!) {
  updateOrder(
    id: $id,
    input: { status: DELIVERING, deliveredById: $driverId }
  ) {
    status
  }
}

`

const updateStatusDriver = gql`
mutation($isFree:Boolean){
  updateDriver(id:"60c0c1a0944ebb003d0acf72",input:{isFree:$isFree}){
    isFree
  }
}
`

const subsOrder = gql`
subscription{
  orderUpdated(where:{status:READY_PICKUP}){
    subtotal
    id
    destination{
      fullAddress
      longitude
      latitude
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
  const { loading: subsLoading, error: subsError, data: subsData } = useSubscription(subsOrder, { fetchPolicy: 'network-only' })
  const [updateIsFree] = useMutation(updateStatusDriver)
  const [updateStatusOrderDriver] = useMutation(updateStatusOrder)
  const [modal, setModal] = useState(false)
  const [destination, setDestination] = useState(null)
  const [delivery, setDelivery] = useState(false)
  const [toComplete, setToComplete] = useState(false)
  const [queue, setQueue] = useState([])

  const handlePickUp = (id) => {
    updateIsFree({ variables: { id, isFree: false } })
      .then(res => {
        setModal(false)
        setDelivery(true)
        setQueue([])
      })
      .catch(err => {
        console.log(err)
        setModal(false)
        setQueue([])
      })
  }

  const handleDelivery = (address, driverId,orderId) => {
    setDelivery(false)
    setDestination({ lat: address.latitude, long: address.longitude })
    setToComplete(true)

    updateStatusOrderDriver({variables:{
      id:orderId,
      driverId
    }})
    .then(res =>{
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })

  }

  const handelComplete = (id) => {
    setDelivery(false)
    setToComplete(false)
    updateIsFree({ variables: { id, isFree: true } })
      .then(res => {
        setQueue([])
      })
      .catch(err => {
        console.log(err)
        setQueue([])
      })
  }

  useEffect(() => {
    const storeData = () => {
      const helpArray = queue
      if (!subsLoading && !subsError) {
        if (subsData.orderUpdated) {
          helpArray.push(subsData.orderUpdated)
          setQueue(helpArray.map(value => value))
          setModal(true)
        }
      }
    }
    storeData()
    return () => {
      setQueue([])
    };
  }, [subsData?.orderUpdated, subsLoading, subsError]);

  if (loading && subsLoading) {
    return <Loading />
  }
  if (error && subsError) {
    return <Error />
  }
  const { address } = data.user.driver.theDriver

  return (
    <React.Fragment>
      {(queue.length > 0 && modal) && (
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
                    <p>Delivery to : <span className={'text-green-600'}>{value.destination.fullAddress ?? 'Kosong'}</span></p>
                  </div>
                </div>
                <div className={'flex flex-1 w-full justify-between'}>
                  <div>
                    <Button title={'Pick Up'} onClick={() => handlePickUp(value.merchant.owner.address, data.user.driver.id)} />
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
      {
        delivery && (
          <div className={'absolute z-20 bottom-3 flex md:m-auto justify-center flex-col  md:w-1/2 w-screen'}>
            {/* <div className={'mx-10'}>
              <Button onClick={()=>setDestination(null)} title={'Delete'} />
            </div> */}
            <div className={'mx-10'}>
              <Button onClick={() => handleDelivery(subsData.orderUpdated.destination,data.user.driver.id,subsData.orderUpdated.id)} title={'Delivery to customer'} />
            </div>
          </div>
        )
      }
      {
        toComplete && (
          <div className={'absolute z-20 bottom-3 flex md:m-auto justify-center flex-col  md:w-1/2 w-screen'}>
            {/* <div className={'mx-10'}>
              <Button onClick={()=>setDestination(null)} title={'Delete'} />
            </div> */}
            <div className={'mx-10'}>
              <Button onClick={() => handelComplete(data.user.driver.id)} title={'Complete'} />
            </div>
          </div>
        )
      }

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