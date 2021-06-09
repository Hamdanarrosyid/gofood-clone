import React from 'react'
import Card from '../components/card'
import Container from '../components/layouts/container'
import TextInput from '../components/TextInput'

const Login = () => {
    return (
        <Container>
            <form action={'#'}>
                <TextInput name={'email'} type={'email'} placeholder={'johndoe@example.com'} label={'Email'}/>
                <TextInput name={'password'} type={'password'} placeholder={'********'} label={'Password'}/>
            </form>
        </Container>
    )
}

export default Login