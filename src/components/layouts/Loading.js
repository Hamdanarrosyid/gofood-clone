import React from'react'

const Loading = () =>{
    return (
        <div className={"flex flex-1 items-center justify-center h-screen bg-white"}>
            <div className={'animate-spin'}></div>
        </div>
    )
}
export default Loading
