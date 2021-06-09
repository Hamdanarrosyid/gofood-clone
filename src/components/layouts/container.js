import React from 'react'

const Container = (props) =>{
    return(
        <div className={'md:w-1/2 w-full bg-white m-auto p-5 h-screen'}>
            {props.children}
        </div>
    )
}

export default Container