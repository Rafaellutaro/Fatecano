//veja test.js para criar o certificado

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const fontkit = require('fontkit');

async function gerarCertificado(nomeAluno, idAluno) {
    // Carregar o modelo de certificado existente
    const modeloBytes = fs.readFileSync('./assets/modelo-certificado.pdf');
    const modeloPdf = await PDFDocument.load(modeloBytes);

    // Criar um novo documento PDF
    const novoPdf = await PDFDocument.create();

    // Registrar o fontkit
    novoPdf.registerFontkit(fontkit);

    // Copiar as páginas do modelo para o novo documento
    const [pagina] = await novoPdf.copyPages(modeloPdf, [0]);
    novoPdf.addPage(pagina);

    // Definir as fontes
    const fonte1Bytes = fs.readFileSync('./assets/fonts/AlexBrush-Regular.ttf');
    const AlexBrush = await novoPdf.embedFont(fonte1Bytes);
    const fonte2Bytes = fs.readFileSync('./assets/fonts/Montserrat-Medium.ttf');
    const Montserrat = await novoPdf.embedFont(fonte2Bytes);

    const tamanhoFonte = 50;

    const paginaAtual = novoPdf.getPage(0);

    // Centraliza o nome horizontalmente
    const posX = (paginaAtual.getWidth() - AlexBrush.widthOfTextAtSize(nomeAluno, tamanhoFonte)) / 1.5; 
    
    // Adicionar o nome ao certificado
    paginaAtual.drawText(nomeAluno, {
        x: posX,
        y: 270,
        size: tamanhoFonte,
        font: AlexBrush,
        color: rgb(0, 0, 0),
    });

   // Adicionar texto ao certificado
    const textoCertificado = [
        `Participou da organização do evento fatecano por um dia, na Fatec de`,
        `Itaquaquecetuba, no dia 21 de outubro de 2024, equivalente a 25 horas`,
    ];
    let posY = 230;

    textoCertificado.forEach(linha => {
        const larguraTexto = Montserrat.widthOfTextAtSize(linha, 12);
        const posX = (paginaAtual.getWidth() - larguraTexto) / 1.8;

        paginaAtual.drawText(linha, {
            x: posX,
            y: posY,
            size: 16,
            font: Montserrat,
            color: rgb(0, 0, 0),
        });
        posY -= 20;
    });

    // Salvar o novo PDF
    const novoPdfBytes = await novoPdf.save();
    fs.writeFileSync(`./assets/certificado-${nomeAluno}-${idAluno}.pdf`, novoPdfBytes);

    return `assets/certificado-${nomeAluno}-${idAluno}.pdf`;
}

module.exports = { gerarCertificado };
