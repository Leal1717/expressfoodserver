import { store } from "../store/store.js"

export default class ActionsCarrinho {
    static setCardapio(data) {
        store.setState({ cardapio: data })
    }

    static selecionarClasse(id) {
        store.setState({ classeSelecionada: id })
    }

    static addCarrinho(item) {
        const novo = [...store.state.carrinho, item]
        store.setState({ carrinho: novo })
    }

    static removeCarrinho(id) {
        const itemremover = store.state.carrinho.find(e => e.id == Number(id))
        if (!itemremover) return
        let carrinho = [...store.state.carrinho]
        carrinho = carrinho.filter(e => e.id !== itemremover.id)
        store.setState({ carrinho: carrinho })
    }

}