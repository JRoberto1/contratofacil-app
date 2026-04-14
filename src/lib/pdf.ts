import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Gera um PDF a partir de um texto, retornando os bytes em Base64.
 * Inclui paginação automática e quebra nativa de linha garantida para o texto.
 */
export async function gerarPDFBase64(texto: string): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const margin = 50;
  
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - margin;

  const quebrarLinha = (text: string, maxWidth: number, isBold: boolean) => {
    const palavras = text.split(' ');
    let formatadas: string[] = [];
    let linhaAtual = '';
    const selectedFont = isBold ? boldFont : font;

    for (const palavra of palavras) {
      // Remover espaços duplos
      if (!palavra) continue;

      const testeLinha = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
      const tamanho = selectedFont.widthOfTextAtSize(testeLinha, fontSize);
      
      if (tamanho > maxWidth) {
        formatadas.push(linhaAtual);
        linhaAtual = palavra;
      } else {
        linhaAtual = testeLinha;
      }
    }
    if (linhaAtual) {
      formatadas.push(linhaAtual);
    }
    return formatadas;
  };

  const paragraphs = texto.split('\n');
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      y -= fontSize * 1.5;
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      continue;
    }

    // Identificar se o parágrafo parece um título (tudo maiúsculo, ou começando com "CLÁUSULA", "CONTRATO", etc)
    // Uma heurística simples para títulos
    const isBold = paragraph === paragraph.toUpperCase() || paragraph.startsWith('CLÁUSULA');
    const selectedFont = isBold ? boldFont : font;

    const lines = quebrarLinha(paragraph, width - margin * 2, isBold);
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line, {
        x: margin,
        y: y,
        size: fontSize,
        font: selectedFont,
        color: rgb(0, 0, 0),
      });
      y -= fontSize * 1.5;
    }
    y -= fontSize * 0.5; // Espaçamento extra após cada parágrafo
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}
