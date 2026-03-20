classesEl.addEventListener('click', (e) => {
    const id = e.target.dataset.id
    if (id) selecionarClasse(id)
})

itensEl.addEventListener('click', (e) => {
    const el = e.target.closest('[data-id]')
    if (!el) return

    const id = el.dataset.id

    const state = store.state
    const classe = state.cardapio.find(c => c.id == state.classeSelecionada)
    const item = classe.item.find(e => e.id == id)

    console.log("achei o id "+id )

    addCarrinho(item)
})

carrinhoEl.addEventListener('click', (e) => {
    const el = e.target.closest('[data-id]')
    if (!el) return

    const id = el.dataset.id

    removeCarrinho(id)
})