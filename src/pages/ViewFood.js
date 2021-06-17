import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Container from '../components/layouts/Container'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'
import Button from '../components/Button'

const orderMutation = gql`
mutation($foodId:String!,$qty:Int!){
    createOrder(input:{items:{foodId:$foodId,quantity:$qty}}){
      id
      items{
        id
        food{
          id
          name
        }
      }
    }
  }
`

const getFoodQuery = gql`
query($id:String!){
    food(id:$id){
      id
      description
      name
      merchant{
        name
        owner{
          id
          firstName
        }
      }
      stock
      price
      image
    }
  }
`

const ViewFood = () => {
    const { id } = useParams()
    const history = useHistory()
    const { loading, error, data } = useQuery(getFoodQuery, { variables: { id } })
    const [createOrder] = useMutation(orderMutation)
    const [quantity, setQuantity] = useState(1)

    const handleBuy = () => {
        createOrder({ variables: { foodId: id, qty: quantity } })
            .then(res => {
                history.push({
                    pathname: '/',
                    state: { status: 'success' }
                });
            })
            .catch(err => {
                history.push({
                    pathname: '/',
                    state: { status: 'error' }
                });
            })
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }


    const { image, description, name, price, stock } = data.food

    return (
        <Container onBack={() => history.goBack()}>
            <div>
                <div className={'h-3/5 overflow-hidden rounded-lg shadow-lg'}>
                    <img src={image} alt={name} className={'h-full w-full'} />
                </div>
                <div className={'my-2'}>
                    <h1 className={'font-bold text-3xl text-green-700'}>{name}</h1>
                    <p className={'text-xl'}><span>Rp</span> {price}</p>
                </div>
            </div>
            <div className={'my-2'}>
                <p>{description}</p>
            </div>
            <div className={'w-full flex'}>
                <div className={'flex-1 flex items-center'}>
                    <button onClick={() => setQuantity(prev => prev - 1)} disabled={quantity < 2 ? true : false} className={`${quantity < 2 ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:ring-opacity-50'}text-white font-bold px-2 rounded-lg focus:outline-none`}>
                        &#x002D;
                    </button>
                    <div className={'mx-2'}>
                        {quantity}
                    </div>
                    <button onClick={() => setQuantity(prev => prev + 1)} disabled={quantity >= stock ? true : false} className={`${quantity >= stock ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:ring-opacity-50'}text-white font-bold px-2 rounded-lg focus:outline-none`}>
                        &#x002B;
                    </button>
                </div>
                <div className={'flex-1 flex justify-end'}>
                    <div className={'w-1/2'}>
                        <Button onClick={handleBuy} title={'Buy'} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ViewFood