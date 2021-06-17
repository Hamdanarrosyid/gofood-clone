import { gql, useMutation } from '@apollo/client'
import Cookies from 'js-cookie'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Loading from './Loading'
import Error from './Error'

const mutationLogout = gql`
mutation($token:String!){
    logout(input:{token:$token}){
      id
    }
  }
`

const BottomButton = (props) => {
    return (
        <button className={'focus:outline-none text-white focus:bg-black focus:bg-opacity-50 p-2 rounded-md'} {...props}>{props.children}</button>
    )
}

const Container = (props) => {
    const history = useHistory()
    const [logout,{loading,error}] = useMutation(mutationLogout)
    const { role, padding = true, onBack, bottom } = props
    const menus = {
        'DRIVER': [{ title: "Map", path: '/map' }],
        'CUSTOMER': [{ title: "Home", path: '/' }],
        'MERCHANT': [{ title: "Home", path: '/' }],
        '': []
    }

    const onLogout = () => {
        logout({variables:{token:Cookies.get('token')}}).then(res=>{
            Cookies.remove('token')
            history.push('/login')
        }).catch(err=>{
            console.log(err)
        })
    }

    const selectedRoleMenu = menus[role ?? '']

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className={'w-screen h-screen overflow-hidden pb-14'}>
            <div className={`md:w-1/2 m-auto w-full p-5 bg-green-700 flex items-center justify-between`}>
                {onBack && (
                    <p onClick={onBack} className={'font-bold cursor-pointer text-white text-xl'}>&#x2190; Back</p>
                )}
                <h1 className="font-bold text-white text-xl">GoPESSS </h1>
                {Cookies.get('token') && (
                    <div>
                        <p onClick={onLogout} className={'font-bold cursor-pointer text-white text-xl'}>&#x8594; Keluar</p>
                    </div>
                )}
            </div>
            <div className={`md:w-1/2 w-full h-full bg-white m-auto ${padding ? 'p-5' : ''} overflow-y-scroll`}>
                {props.children}
            </div>
            {bottom && (
                <div className="md:w-1/2 m-auto w-full p-5 bg-green-700 flex items-center justify-around">
                    {selectedRoleMenu.map((value) => (
                        <BottomButton type={'button'} onClick={() => history.push(value.path)}>{value.title}</BottomButton>
                    ))}
                    {/* <BottomButton type={'button'} onClick={()=>console.log('asdasd')}>Status</BottomButton>
                <BottomButton type={'button'} onClick={()=>console.log('asdasd')}>Home</BottomButton>
                <BottomButton type={'button'} onClick={()=>console.log('asdasd')}>Order</BottomButton>
                <BottomButton type={'button'} onClick={()=>console.log('asdasd')}>Logout</BottomButton> */}
                </div>

            )}
        </div>
    )
}

export default Container