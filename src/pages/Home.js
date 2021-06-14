import { gql, useQuery } from '@apollo/client'
import React from 'react'
import Card from '../components/Card'
import Container from '../components/layouts/Container'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'
import { useHistory } from 'react-router-dom'

const queryFood = gql`
query{
    foods{
      name
      merchant{
        name
        id
        owner{
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
    const {loading,data,error} = useQuery(queryFood)
    const history  = useHistory()

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }
    return (
        <Container role={'customer'}>
            <div>
                <div className="py-2">
                    <h1>Foodies</h1>
                </div>
                <div className="grid flex-wrap gap-4 grid-cols-2">
                    {data.foods.map((value)=>(
                        <Card onClick={()=>history.push(`food/${value.id}`)} image={value.image} name={value.name} price={value.price} merchant={value.merchant.name} key={value.id}/>
                    ))}                    
                </div>
            </div>
        </Container>
    )
}

export default Home