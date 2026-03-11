interface ReqBody {
    "ip": string, //"192.168.100.126", // IP da impressora na rede
    "nome_fantasia": string, // "Meu mercadinho",
    "itens": ReqBodyItem[],
    "total": string, // "R$ 723,40",
    "desconto"?: string, // "R$ 723,40",
}   

interface ReqBodyItem {
    "item": string, // "X burguer", 
    "qtd": number, //3, 
    "preco": string, // "R$ 343,00", 
    "obs"?: string[], // ["Sem milho", "Com bacon"]
}   