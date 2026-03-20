const classesEl = document.getElementById("classes")
const itensEl = document.getElementById("itens")
const carrinhoEl = document.getElementById("carrinho")

function render(state) {
    renderClasses(state)
    renderItens(state)
    renderCarrinho(state)
}

function renderClasses(state) {
    classesEl.innerHTML = state.cardapio.map(c => `
        <div data-id="${c.id}">
            ${c.nome}
        </div>
    `).join('')
}


function renderItens(state) {
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


function renderCarrinho(state) {
    const elementos = store.state.carrinho.map(c => {
        if (!c) return
        return `
            <div data-id="${c.id}">
                <div>${c.nome}</div>
            </div>
        `
    })


    carrinhoEl.innerHTML= `
        <div>
            <div>Total</div>
            <div>${store.state.total}</div>
            <div>${elementos}</div>
        </div>
    `
}