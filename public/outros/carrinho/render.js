import ActionsCarrinho from "../cardapio/actions.js"
import { getTotal, store } from "../store/store.js"

const itensEl = document.getElementById("itens")
const totalEl = document.getElementById("total")


export default class RenderCarrinho {
    
    static render(state) {
        this.renderItens(state)
    }


    static renderItens(state) {
        const html  = store.state.carrinho.map(e => `
                <div class="row" data-id="${e.id}">
                    <div> ${e.nome} </div>

                    <div>
                        <div> ${e.preco} </div>
                        <button class='btn-deletar'> Deletar </button>
                    </div>
                </div>
            `).join('')
        itensEl.innerHTML = html  

        const total = getTotal()
        totalEl.innerHTML = `
                <div class="row">
                    <div> Total </div>
                    <div> ${total} </div>
                </div>
        `

        this.setupEvents()
    }

    static setupEvents() {
        itensEl.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-deletar")
            if (!btn) return

            const id = btn.closest("[data-id]").dataset.id
            ActionsCarrinho.removeCarrinho(id)
        })
    }


}