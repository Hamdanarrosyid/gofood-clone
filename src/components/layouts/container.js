import React from 'react'

const Container = (props) =>{
    return(
        <div className={'md:w-1/2 w-full bg-white  h-100'}>
            {props.children}
        </div>
    )
}

export default Container