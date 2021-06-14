import Container from '../components/layouts/Container'
import React from 'react';
import { gql, useQuery } from '@apollo/client'
import { data } from 'autoprefixer';
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'

const queryFoodie = gql`
query {
    foods {
      image
      name
      price
    }
  }  
`


const ViewFood = () => {
    const { loading, data, error } = useQuery(queryFoodie)

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }
    return (
        <Container role={"customer"}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", width: "612px", height: "567px", backgroundColor: "#DEDEDE", border: "1px solid black", borderRadius: "10px", marginLeft: "auto", marginRight: "auto", marginTop: "100px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "349px", height: "249px", backgroundColor: "red", marginTop: "30px", borderRadius: "10px" }} />
                    <h1 style={{ fontSize: "30pt", fontWeight: "bold" }}>Merchant 1</h1>
                </div>
                <div style={{ marginTop: "50px" }}>
                    <h1 style={{ fontSize: "25pt", fontWeight: "bold" }}>SegoGoreng</h1>
                    <h1 style={{ fontSize: "20pt", fontWeight: "bold" }}>price :20,000</h1>
                </div>

            </div>
        </Container>
    )
}
export default ViewFood;
