import React from 'react'

const TextInput = (props) => {
    const {name,label,placeholder,type,onChange,value,autocomplete} = props
    return (
        <div className="flex flex-col mb-4">
            <label className="mb-2 font-bold text-lg text-grey-darkest" for={name}>{label}</label>
            <input autocomplete={autocomplete??''} onChange={onChange} name={name} value={value} type={type} required placeholder={placeholder??''} className="shadow-lg p-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent" />
        </div>
    )
}

export default TextInput