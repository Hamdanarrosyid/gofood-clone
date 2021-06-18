import { gql, useQuery } from '@apollo/client'
import React,{useState,useEffect} from 'react'
import Card from '../components/Card'
import Container from '../components/layouts/Container'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'
import { useHistory,useLocation } from 'react-router-dom'
import Map from '../pages/Map';
import Merchant from './Merchant'

const queryFood = gql`
query {
    user {
      id
      role
    }
    foods(where:{stock_not:0}) {
      name
      merchant {
        name
        id
        owner {
          firstName
        }
      }
      stock
      price
      image
      id
    }
  }
  
`

const Home = () => {
    const { loading, data, error } = useQuery(queryFood, { fetchPolicy: 'network-only' })
    const [status, setStatus] = useState('')
    const history = useHistory()
    const location = useLocation()
    const {state} = location


    useEffect(() => {
        const setThisStatus = () =>{
            if(state){
                setStatus(state.status)
            }
        }

        setThisStatus()
        return () => {
           history.replace({state:''})
        };
    }, [history,state]);

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    const { user } = data
    return (
        <Container padding={user.role !== 'DRIVER'} role={user.role}>
            {user.role === 'DRIVER' ? (
                <Map />
            ) : user.role === 'CUSTOMER' ? (
                <div>
                    {status.length > 0 && (
                        <div className={`absolute ${status === 'success' ? 'bg-green-300' : 'bg-red-300'} rounded-lg flex duration-700 items-center`}>
                            <p className={'text-md p-3 '}>{status === 'success' ? 'Order successfully made, please wait for your order!' : 'The order failed to make, because an error occurred'}</p>
                            <p onClick={() => setStatus('')} className={'border-l p-3 cursor-pointer'}>&#x2715;</p>
                            {/* <div className={''}/> */}
                        </div>
                    )}
                    <div className="py-2">
                        <h1 className={"font-bold text-green-700 text-xl"}>Foodies</h1>
                    </div>
                    <div className="grid flex-wrap gap-4 grid-cols-2">
                        {data.foods.map((value) => (
                            <Card onClick={() => history.push(`food/${value.id}`)} image={value.image} name={value.name} price={value.price} merchant={value.merchant.name} key={value.id} />
                        ))}
                    </div>
                </div>

            ) : (
                <Merchant user={user} />
            )}
        </Container>
    )
}

export default Home