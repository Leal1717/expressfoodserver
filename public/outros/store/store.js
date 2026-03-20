
export const store = {
    state: {
        mapaMesas: [],
        cardapio: [],
        classeSelecionada: null,
        carrinho: JSON.parse(localStorage.getItem('carrinho') || '[]'),
    },


    listeners: [],


    setState(partial) {
        this.state = { ...this.state, ...partial }

        localStorage.setItem('carrinho', JSON.stringify(this.state.carrinho))

        // refresh render
        this.listeners.forEach(fn => fn(this.state))
    },


    subscribe(fn) {
        this.listeners.push(fn)
        fn(this.state)
    }
}

export function getTotal() {
    let carrinho = [...store.state.carrinho]
    let total = 0.0
    carrinho.forEach(e => {
        total = total + Number(e.preco)
    })
    return total
}