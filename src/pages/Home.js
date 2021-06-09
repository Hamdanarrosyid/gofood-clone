import React from 'react'
import Card from '../components/card'
import Container from '../components/layouts/container'


const Home = () => {
    return (
        <Container>
            <div>
                <div className="py-2">
                    <h1>Foodies</h1>
                </div>
                <div className="grid flex-wrap gap-4 grid-cols-2">
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                    <Card name={'Sego Goreng'} price={'20000'} merchant={'pundong food'} />
                </div>
            </div>
        </Container>
    )
}

export default Home