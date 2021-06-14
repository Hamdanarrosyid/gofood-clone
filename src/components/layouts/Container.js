import React from 'react'
import { useHistory } from 'react-router-dom'

const BottomButton = (props) => {
    return (
        <button className={'focus:outline-none text-white focus:bg-black focus:bg-opacity-50 p-2 rounded-md'} {...props}>{props.children}</button>
    )
}

const Container = (props) => {
    const history = useHistory()
    const { role, padding = true, back, onBack,bottom } = props
    const menus = {
        'driver': [{ title: "Map", path: '/map' }],
        'customer': [{ title: "Home", path: '/' }],
        'admin': [{ title: "Home", path: '/' }],
        '': []
    }

    const selectedRoleMenu = menus[role ?? '']

    return (
        <div className={'w-screen h-screen overflow-hidden pb-14'}>
            <div className={`md:w-1/2 m-auto w-full p-5 bg-green-700 flex items-center ${onBack ? 'justify-between' : 'justify-center'}`}>
                {onBack && (
                    <p onClick={onBack} className={'font-bold cursor-pointer text-white text-xl'}>&#x2190; Back</p>
                )}
                <h1 className="font-bold text-white text-xl">GoPESSS </h1>
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