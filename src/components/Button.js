import React from 'react'

const Button = (props) => {
    const { title,type,onClick,color='green',className='' } = props
    return (
        <button type={type??'button'} onClick={onClick} className={`${className} text-white w-full font-bold p-2 rounded-lg bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-600 focus:ring-opacity-50`}>
            {title}
        </button>
    )
}

export default Button