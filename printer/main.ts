import { app, Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import express from 'express';
import cors from 'cors';
import { ThermalPrinter, PrinterTypes, CharacterSet } from 'node-thermal-printer';
import path from 'path';

const PORT = 3030
const server = express();
let tray = null;

// --- 1. LÓGICA DO SERVIDOR EXPRESS ---
server.use(cors());
server.use(express.json());

const itensImprimir = [
    {item: "X burguer", qtd: 3, preco: "R$ 343,00", obs: ["Sem milho", "Com bacon"]},
    {item: "X Bacon", qtd: 1, preco: "R$ 68,40", obs: ["Sem salada"]},
    {item: "Coca lata", qtd: 1, preco: "R$ 6,00", obs: []},
]

/**
 * inicia o objeto printer
 */
function iniciar(reqbody: ReqBody) : ThermalPrinter {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON, // Altere para STAR se necessário
        interface: `tcp://${reqbody.ip}`,
        // characterSet: CharacterSet.WPC1252_WESTERN_EUROPEAN,
        characterSet: CharacterSet.PC860_PORTUGUESE,
        removeSpecialCharacters: false,
    });
    return printer
}


/**
 * 
 * Adciona o conteudo todo aqui
 */
function adicionarConteudo(printer:ThermalPrinter, reqbody:ReqBody) {
    printer.alignCenter();
    printer.println(reqbody.nome_fantasia);
    printer.newLine();
    printer.alignLeft();
    printer.newLine();

    // tabela de itens
    fazerTabela(printer, itensImprimir)

    printer.newLine();
    printer.newLine();
    if (reqbody.desconto) {
        printer.leftRight("Desconto", reqbody.desconto)
    }
    printer.bold(true);
    printer.leftRight("TOTAL", reqbody.total)
    printer.bold(false);
    printer.alignCenter();

    printer.drawLine()
    printer.newLine();

    // Comando ESC/POS para Corte Total (GS V 0)
    printer.append(Buffer.from([0x1D, 0x56, 0x00]));
    printer.cut({verticalTabAmount: 1})
}



/**
 * faz a tabela com itens e precos e quantidades
 */
function fazerTabela(printer:ThermalPrinter, itens: ReqBodyItem[]) {
    for (const i of itens) {
        printer.tableCustom([
            // { text: i.qtd + "x", align: "LEFT", width: 0.1 },
            { text: i.qtd + "x  " + i.item, align: "LEFT", width: 0.6 },
            { text: i.preco, align: "RIGHT", width: 0.3 }
        ])
        if (i.obs && i.obs.length > 0) {
            for(const ob of i.obs) {
                printer.println("   - " + ob)
            }
            printer.newLine()
        }
    }
}



server.post('/imprimir', async (req, res) => {
    const reqbody:ReqBody = req.body;

    const printer = iniciar(reqbody);

    adicionarConteudo(printer, reqbody);

    try {
        const isConnected = await printer.isPrinterConnected();
        if (!isConnected) throw new Error("Impressora offline na rede");
        await printer.execute();
        res.send({ status: "Sucesso", message: "Impresso com sucesso!" });
    } catch (error:any) {
        console.error("Erro na impressão:", error);
        res.status(500).send({ status: "Erro", message: error.message ?? error.toString()});
    }
});




server.get('/handshake', (req, res) => {
    res.send({"status":"working", "port": PORT})
})




server.listen(PORT, () => {
    console.log("🚀 Servidor de Impressão rodando na porta 3030");
});



// --- 2. LÓGICA DO ELECTRON (Tray e Ciclo de Vida) ---
app.whenReady().then(() => {
    // Para o ícone: você precisa de um arquivo 'icon.png' na pasta raiz
    // Se não tiver, o Electron pode dar erro ou mostrar ícone padrão
    const iconPath = path.join(process.cwd(), 'icon.png'); 
    const icon = nativeImage.createFromPath(iconPath);
    
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Mini Food: Agente de Impressão', enabled: false },
        { type: 'separator' },
        { label: `Status: Online (Porta ${PORT})`, enabled: false },
        { type: 'separator' },
        { 
            label: 'Sair', 
            click: () => {
                app.quit();
            } 
        }
    ]);

    tray.setToolTip('Agente de Impressão Térmica');
    tray.setContextMenu(contextMenu);

    createWindow()

    // Evita que o app feche se não houver janelas abertas
    app.on('window-all-closed', () => {});
    
    console.log("✅ Agente carregado na bandeja do sistema!");
});







/**
Tipo de Barcode     ID Numérico     Recomendação
UPC-A               65              Padrão Americano (12 dígitos)
EAN13               67              Padrão Brasileiro (13 dígitos)
CODE39              69              Aceita letras e números (Livre)
CODE128             73              O mais versátil e compacto
 */










let mainWindow: BrowserWindow | undefined | null = null;

// 1. Função para criar ou mostrar a janela
function createWindow() {
    // Se a janela já existe, apenas foca nela
    if (mainWindow) {
        mainWindow.show();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(process.cwd(), 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });


    // Carregue o seu HTML aqui
    mainWindow.loadFile('index.html');

    // Quando o usuário clica no "X", apenas escondemos a janela em vez de fechar o app
    mainWindow.on('close', (event) => {
        if (app.isReady()) {
            event.preventDefault();
            mainWindow?.hide()
        }
        return false;
    });
}