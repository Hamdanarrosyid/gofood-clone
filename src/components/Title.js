import React from 'react'

const Title = (props) => {
    return (
        <h1 className={'font-bold text-green-700 text-2xl'}>{props.children}</h1>
    )
}

export default Title