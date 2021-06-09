import React from 'react'

const Container = (props) => {
    return (
        <div className={'w-screen h-screen'}>
            <div className="md:w-1/2 m-auto w-full p-5 bg-green-700 flex items-center justify-center">
                <h1 className="font-bold text-white text-xl">GoFood</h1>
            </div>
            <div className={'md:w-1/2 w-full h-full bg-white m-auto p-5 overflow-y-scroll'}>
                {props.children}
            </div>
            <div className="md:w-1/2 m-auto w-full p-5 bg-green-700 flex items-center justify-around">
                <p className="font-bold text-white text-xl">User</p>
                <p className="font-bold text-white text-xl">Status</p>
                <p className="font-bold text-white text-xl">Home</p>
                <p className="font-bold text-white text-xl">Order</p>
                <p className="font-bold text-white text-xl">Logout</p>
            </div>
        </div>
    )
}

export default Container