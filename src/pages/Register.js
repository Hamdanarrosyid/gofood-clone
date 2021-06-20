import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import Error from '../components/layouts/Error'
import Loading from '../components/layouts/Loading'
import Container from '../components/layouts/Container'
import Button from '../components/Button'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router'

const mutationRegister = gql`
mutation($input:RegisterInput){
    register(input:$input){
      user{
        id
        firstName
      }
    }
  }
`

const Register = () => {
    const [postRegister, { loading, error }] = useMutation(mutationRegister)
    const [registerState, setRegisterState] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
    const [showError, setShowError] = useState(false)
    const history = useHistory()

    const handleChange = (e) => {
        setRegisterState({
            ...registerState,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const { password, confirmPassword, email, firstName, lastName } = registerState
        if ((password !== confirmPassword) || (password === '')) {
            setShowError(true)
        } else {
            postRegister({ variables: { input: { firstName, lastName, email, password,role:'CUSTOMER' } } })
                .then(res => {
                    history.push('/login')
                })
                .catch(err => {
                    console.log(err)
                })
        }
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
                            <h1 className={'font-bold text-white text-2xl'}>Register</h1>
                        </div>
                        <div className={'grid grid-cols-2 gap-3'}>
                            <div>
                                <TextInput autoComplete={'firstname'} value={registerState.firstName} onChange={handleChange} name={'firstName'} type={'text'} placeholder={'john'} label={'First Name'} />
                            </div>
                            <div>
                                <TextInput autoComplete={'lastname'} value={registerState.lastName} onChange={handleChange} name={'lastName'} type={'text'} placeholder={'doe'} label={'Last Name'} />
                            </div>
                        </div>
                        <TextInput autoComplete={'email'} value={registerState.email} onChange={handleChange} name={'email'} type={'email'} placeholder={'johndoe@example.com'} label={'Email'} />
                        <TextInput value={registerState.password} onChange={handleChange} name={'password'} type={'password'} placeholder={'********'} label={'Password'} />
                        <TextInput value={registerState.confirmPassword} onChange={handleChange} name={'confirmPassword'} type={'password'} placeholder={'********'} label={'Confirm Password'} />
                        {showError && (
                            <div className={'flex'}>
                                <p className={'mb-4 rounded-md p-1 font-bold backdrop-filter text-red-500'}>The password does not match. Try again.</p>
                            </div>
                        )}
                        <Button title={'Submit'} type={'Submit'} />
                        <div className={'text-center mt-5'}>
                            <p className={'text-white font-bold'}>already have an account? <span className={'underline text-green-500 backdrop-filter cursor-pointer'} onClick={()=>history.push('/login')}>Login</span></p>
                        </div>
                    </form>
                )}
            </div>
        </Container>
    )
}

export default Register