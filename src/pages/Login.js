import React, { useState } from 'react'
import Container from '../components/layouts/Container'
import TextInput from '../components/TextInput'
import Cookie from 'js-cookie'
import Button from '../components/Button'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Loading from '../components/layouts/Loading'
import Error from '../components/layouts/Error'


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
    const [login, { loading, error }] = useMutation(loginMutation)

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
                const { token } = res.data.login
                Cookie.set('token', token)
                history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <Container>
            <div className={'flex h-full items-center'}>
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error />
                ) : (
                    <form action={'#'} method={'post'} onSubmit={handleSubmit} className={'w-full bg-gray-500 p-5 rounded-lg'}>
                        <div className={'w-full flex justify-center py-5'}>
                            <h1 className={'font-bold text-white text-2xl'}>Login</h1>
                        </div>
                        <TextInput autoComplete={'email'} value={loginState.email} onChange={handleChange} name={'email'} type={'email'} placeholder={'johndoe@example.com'} label={'Email'} />
                        <TextInput value={loginState.password} onChange={handleChange} name={'password'} type={'password'} placeholder={'********'} label={'Password'} />
                        <Button title={'Submit'} type={'Submit'} />
                        <div className={'text-center mt-5'}>
                            <p className={'text-white font-bold'}>don't have an account?<span className={'underline text-green-500 backdrop-filter cursor-pointer'} onClick={()=>history.push('/register')}> Register</span></p>
                        </div>
                    </form>
                )}
            </div>
        </Container>
    )
}

export default Login