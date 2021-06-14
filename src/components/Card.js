import React from 'react'

const Card = (props) => {
    const { name, merchant, price, image,onClick } = props
    return (
        <div onClick={onClick} className={'shadow-lg h-52 cursor-pointer md:h-80 flex flex-col rounded-lg overflow-hidden'}>
            <div className="w-full h-3/5">
                <img className="w-full h-full" src={image} alt={name} />
            </div>
            <div className="flex-1 flex justify-center flex-col p-2">
                <p>{merchant}</p>
                <div className={'flex justify-between'}>
                    <h2>{name}</h2>
                    <p>Rp {price}</p>
                </div>
            </div>
        </div>
    )
}

export default Card