async function init() {
    store.subscribe((state) => render(state))

    const res = await axios.get("/api/itenspdv/classes", {headers: headers()})
    setCardapio(res.data)
}

init()