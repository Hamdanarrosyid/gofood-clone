import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
import Error from '../components/layouts/Error'
import Loading from '../components/layouts/Loading'

const ordersQuery = gql`
query($id:String!) {
    items(where:{order:{merchant:{ownerId:$id}}}) {
      quantity
      order {
        status
        id
        subtotal
      }
      id
      food {
        name
        price
        image
        id
        
      }
    }
  }
  
`
const updateOrderStatus = gql`
mutation($status:OrderStatus,$id:String!){
    updateOrder(input:{status:$status},id:$id){
      id
      status
    }
  }
`
const ListItem = (props) => {
    return (
        <div className={'p-3 mb-3 shadow-lg flex justify-between items-center border'}>
            <div className={'flex flex-col'}>
                <div className={'w-24'}>
                    <img src={props.food.image} alt={props.food.name} />
                </div>
                <p className={'text-lg text-green-600 font-bold'}>{props.food.name}</p>

                <p className={'text-md'}>Harga : Rp {props.food.price}</p>
            </div>
            <div className={'flex flex-col items-end justify-between flex-1 h-full'}>
                {props.action}
                <p className={'my-2 text-sm'}>Quantity : {props.quantity}</p>
                <p className={'text-md'}>Total : Rp {props.order.subtotal}</p>
            </div>
        </div>
    )
}

const EmptyItem = () => {
    return (
        <div className={'items-center flex justify-center rounded-lg'}>
            <p>Empty</p>
        </div>
    )
}

const Merchant = ({ user }) => {
    const { loading, data, error } = useQuery(ordersQuery, { variables: { id: user.id } })
    const [state, setState] = useState({ pending: [], onProcess: [], readyPickup: [] })
    const [changestatus,update] = useMutation(updateOrderStatus)

    const handleupdate = (id, status) => {
        // console.log(id,status)
        changestatus({ variables: { id, status } })
            .then(res => res)
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (!loading && !error) {

            const pending = data.items.filter(value => value.order.status === 'PENDING')
            const onProcess = data.items.filter(value => value.order.status === 'ON_PROCESS')
            const readyPickup = data.items.filter(value => value.order.status === 'READY_PICKUP')

            setState({
                pending,
                onProcess,
                readyPickup
            })
        }
        return () => null

    }, [loading,update.loading]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <React.Fragment>
            <h1 className={"text-lg py-2 font-bold"}>Pending</h1>
            {state.pending.length < 1 ? (
                <EmptyItem />
            ) : state.pending.map(value => (
                <ListItem {...value} key={value.id} action={
                    <div className={'flex '}>
                        <Button className={'mx-1'} onClick={() => handleupdate(value.order.id, 'ON_PROCESS')} title={"Accept"} color={'green'} />
                        <Button className={'mx-1'} onClick={() => handleupdate(value.order.id, 'CANCELLED')} title={"Reject"} color={'red'} />
                    </div>
                } />
            ))}
            <h1 className={"text-lg py-2 font-bold"}>On Process</h1>
            {state.onProcess.length < 1 ? (
                <EmptyItem />
            ) : state.onProcess.map(value => (
                <ListItem {...value} key={value.id} action={
                    <div >
                        <Button onClick={() => handleupdate(value.order.id, 'READY_PICKUP')} className={'mx-1'} title={"Ready"} color={'green'} />
                    </div>
                } />
            ))}
            <h1 className={"text-lg py-2 font-bold"}>Ready To Pickup</h1>
            {state.readyPickup.length < 1 ? (
                <EmptyItem />
            ) : state.readyPickup.map(value => (
                <ListItem {...value} key={value.id} />
            ))}

        </React.Fragment>
    )
}

export default Merchant