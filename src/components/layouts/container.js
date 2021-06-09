import React from 'react'

const Container = (props) =>{
    return(
        <div className={'md:w-80 w-screen bg-white m-auto p-5 h-screen'}>
            {props.children}
        </div>
    )
}

export default Container