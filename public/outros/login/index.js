import axios from 'https://cdn.jsdelivr.net/npm/axios/+esm'
import { salvarToken } from '../index.js'



const btnEntrarEl = document.getElementById("btn-entrar")
const emailEl = document.getElementById("email")
const senhaEl = document.getElementById("senha")

btnEntrarEl.addEventListener('click', entrar)

export function entrar() {
    const body = { email: emailEl.value, senha: senhaEl.value }
    axios.post("/api/auth/login", body).then((res ) => {
        console.log(res)
        console.log(res.data)
        salvarToken(res.data.access_token)


        location.assign("/cardapio/classes")

    }).catch(err=> {console.error(err)}) 
}