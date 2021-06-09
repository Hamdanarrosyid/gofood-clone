import React, { useState } from 'react'
import Container from '../components/layouts/container'
import TextInput from '../components/TextInput'
import Cookie from 'js-cookie'
import Button from '../components/Button'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'


const loginMutation = gql`
mutation($input:LoginInput){
    login(input:$input){
      token
    }
  }
`

const Login = () => {
    const history = useHistory()
    const [loginState, setLoginState] = useState({ email: '', password: '' })
    const [login] = useMutation(loginMutation)

    const handleChange = (e) => {
        setLoginState({
            ...loginState,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        login({ variables: { input: loginState } })
            .then(res => {
                const {token} = res.data.login
                console.log(res)
                Cookie.set('token',token)
                history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Container>
            <div className={'flex h-full items-center'}>
                <form action={'#'} method={'post'} className={'w-full bg-gray-500 p-5 rounded-lg'}>
                    <div className={'w-full flex justify-center py-5'}>
                        <h1 className={'font-bold text-white text-2xl'}>Login</h1>
                    </div>
                    <TextInput autocomplete={'email'} value={loginState.email} onChange={handleChange} name={'email'} type={'email'} placeholder={'johndoe@example.com'} label={'Email'} />
                    <TextInput value={loginState.password} onChange={handleChange} name={'password'} type={'password'} placeholder={'********'} label={'Password'} />
                    <Button title={'Submit'} type={'Submit'} onClick={handleSubmit} />
                </form>
            </div>
        </Container>
    )
}

export default Login