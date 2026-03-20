import { headers } from "../index.js"
import { store } from "../store/store.js"
import ActionsCarrinho from "./actions.js"
import RenderCardapio from "./render.js"
import axios from 'https://cdn.jsdelivr.net/npm/axios/+esm'

async function init() {
    store.subscribe((state) => RenderCardapio.render(state))
    const res = await axios.get("/api/itenspdv/classes", {headers: headers()})
    ActionsCarrinho.setCardapio(res.data)
}

init()



const classesEl = document.getElementById("classes")
const itensEl = document.getElementById("itens")
const carrinhoEl = document.getElementById("carrinho")
const btnCarrinhoEl = document.getElementById("btn-carrinho")


classesEl.addEventListener('click', (e) => {
    console.log("clicaram me")
    const id = e.target.dataset.id
    if (id) ActionsCarrinho.selecionarClasse(id)
})

itensEl.addEventListener('click', (e) => {
    const el = e.target.closest('[data-id]')
    if (!el) return

    const id = el.dataset.id

    const state = store.state
    const classe = state.cardapio.find(c => c.id == state.classeSelecionada)
    const item = classe.item.find(e => e.id == id)

    ActionsCarrinho.addCarrinho(item)
})

carrinhoEl.addEventListener('click', (e) => {
    
})

btnCarrinhoEl.addEventListener('click', () => {
    location.assign("/carrinho/itens")
})