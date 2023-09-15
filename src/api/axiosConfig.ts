import axios from 'axios'

// Create an axios instance with custom configuration
const api = axios.create({
    baseURL: 'https://api.spotify.com/',
})

// add the spotify token from localStorage to all outgoing requests
api.interceptors.request.use(
    (config) => {
        // Access the cookies that store the JWT and user info
        const authData = JSON.parse(localStorage.getItem('auth') ?? '{}')
        const token = authData.token || ''

        if (!token) {
            throw new Error('Authentication requred')
        }

        // Create a new headers object with the merged headers
        config.headers = Object.assign({}, config.headers, {
            Authorization: `Bearer ${token}`
        });

        return config
    },
    (error) => {
        // Handle request error here
        return Promise.reject(error)
    }
)

// add the spotify token from localStorage to all outgoing requests
api.interceptors.response.use(
    (response) => {
        // const signOut = useSignOut()

        if (response.status === 401) {
            // signOut()
            console.log("must re-authenticate")
            localStorage.clear()
        }

        return response
    },
    (error) => {
        // Handle request error here
        return Promise.reject(error)
    }
)

export default api


