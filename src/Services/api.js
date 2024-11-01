import axios from "axios"

const api = axios.create({
    baseURL: "https://localhost:5000/api", //altere o endereço da sua api
})

export default api;