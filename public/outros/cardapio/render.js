import { getTotal, store } from "../store/store.js"

const classesEl = document.getElementById("classes")
const itensEl = document.getElementById("itens")
const carrinhoEl = document.getElementById("carrinho")


export default class RenderCardapio {
    
    static render(state) {
        this.renderClasses(state)
        this.renderItens(state)
        this.renderCarrinho(state)
    }

    static renderClasses(state) {
        classesEl.innerHTML = state.cardapio.map(c => `
            <div data-id="${c.id}">
                ${c.nome}
            </div>
        `).join('')
    }


    static renderItens(state) {
        const classe = state.cardapio.find(c => c.id == state.classeSelecionada)
        if (!classe) {
            itensEl.innerHTML = ''
            return
        }

        itensEl.innerHTML = classe.item.map(i => `
            <div data-id="${i.id}">
                <div>${i.nome}</div>
                <div>${i.preco}</div>
            </div>
            `
        ).join('')
    }


    static renderCarrinho(state) {
        const total = getTotal()

        carrinhoEl.innerHTML= `
            <div>
                <div>Total</div>
                <div>${total}</div>
            </div>
        `
    }
}