export default class Actions {
    static setCardapio(data) {
        store.setState({ cardapio: data })
    }

    static selecionarClasse(id) {
        store.setState({ classeSelecionada: id })
    }

    static addCarrinho(item) {
        const novo = [...store.state.carrinho, item]
        store.setState({ carrinho: novo })
        precoTotal()
    }

    static removeCarrinho(id) {
        const itemremover = store.state.carrinho.find(e => e.id == Number(id))
        if (!itemremover) return
        let carrinho = [...store.state.carrinho]
        carrinho = carrinho.filter(e => e.id !== itemremover.id)
        store.setState({ carrinho: carrinho })
        precoTotal()
    }

    static precoTotal() {
        let carrinho = [...store.state.carrinho]
        let total = 0.0
        carrinho.forEach(e => {
            total = total + Number(e.preco)
        })
        store.setState({total: total})
    }
}