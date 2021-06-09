import React from 'react'

const Card = (props) => {
    const { name, merchant, price, image } = props
    return (
        <div className={'shadow-lg h-52 flex flex-col rounded-lg overflow-hidden'}>
            <div className="w-full h-3/5">
                <img className="w-full h-full" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmishkanet.com%2Fimg%2F6939d01eb3ae969a0f3d284ae998b243.jpg&f=1&nofb=1" alt="img" />
            </div>
            <div className="flex-1 flex justify-center flex-col p-2">
                <p>{merchant}</p>
                <div className={'flex justify-between'}>
                    <h2>{name}</h2>
                    <p>{price}</p>
                </div>
            </div>
        </div>
    )
}

export default Card