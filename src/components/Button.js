import React from 'react'

const Button = (props) => {
    const { title,type,onClick } = props
    return (
        <button type={type??'button'} onClick={onClick} class="text-white font-bold p-2 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 ...">
            {title}
        </button>
    )
}

export default Button