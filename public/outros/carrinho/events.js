import ActionsCarrinho from "../cardapio/actions.js";
import { getTotal, store } from "../store/store.js"
import RenderCarrinho from "./render.js";

// async function init() {
//     store.subscribe((state) => RenderCarrinho.render(state))
//     const res = await axios.get("/api/itenspdv/classes", {headers: headers()})
//     ActionsCarrinho.setCardapio(res.data)
// }

// init()



const itensEl = document.getElementById("itens")
const totalEl = document.getElementById("total")

function init() {
    store.subscribe((state) => RenderCarrinho.renderItens(state))
}

init()






