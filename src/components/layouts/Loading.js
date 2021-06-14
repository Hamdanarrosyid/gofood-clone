import React from 'react'

const Loading = () => {
    return (
        <div className={'w-screen h-screen overflow-hidden pb-14'}>
            <div className={`md:w-1/2 m-auto w-full p-5 flex bg-white h-full items-center justify-center`}>
                {/* <div className={"flex flex-1 items-center justify-center w-full h-screen bg-white"}> */}
                <div className={'animate-spin text-green-700 font-blold'}>====</div>
            </div>
        </div>
    )
}
export default Loading
