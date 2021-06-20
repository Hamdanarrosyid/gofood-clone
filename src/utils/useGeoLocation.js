import React,{useEffect,useState} from 'react'
const useGeoLocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        error: true,
        coordinates: {
            lat: '',
            lang: ''
        }
    })

    const onSuccess = (success) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: success.coords.latitude,
                lng: success.coords.longitude
            }
        })
    }
    const onError = (error) => {
        setLocation({
            loaded: true,
            error
        })
    }

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            onError({
                message: 'Geolocation not supported'
            })
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError)

    }, []);

    return location
}

export default useGeoLocation