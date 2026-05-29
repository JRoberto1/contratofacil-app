import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Remove símbolos de markdown do texto, deixando conteúdo legível para o PDF.
 */
function markdownParaTexto(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")           // remove ## títulos
    .replace(/\*\*(.+?)\*\*/g, "$1")        // remove **negrito**
    .replace(/\*(.+?)\*/g, "$1")            // remove *itálico*
    .replace(/^[-*]\s+/gm, "- ")            // bullet points em ASCII puro (• quebra WinAnsi)
    .replace(/^>\s+/gm, "")                 // remove blockquotes
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1") // remove `código`
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")     // remove [links](url)
    .replace(/_{2}(.+?)_{2}/g, "$1")        // remove __negrito__
    .replace(/_(.+?)_/g, "$1")              // remove _itálico_
    .replace(/\n{3,}/g, "\n\n")             // máximo 2 quebras de linha
    // ── Sanitização WinAnsi: substitui caracteres fora do Windows-1252 ──────
    .replace(/—|–/g, "-")         // em dash / en dash → hífen ASCII
    .replace(/[‘’]/g, "'")        // smart quotes simples → '
    .replace(/[“”]/g, '"')        // smart quotes duplas → "
    .replace(/…/g, "...")              // reticências → ...
    .replace(/•/g, "-")               // bullet U+2022 → hífen (segurança extra)
    .replace(/·/g, "-")               // middle dot → hífen
    .replace(/[^\x00-\xFF]/g, "?")         // qualquer outro não-Latin1 → ?
    .trim();
}

/**
 * Gera um PDF a partir de um texto (markdown ou texto puro),
 * retornando os bytes em Uint8Array.
 * Inclui paginação automática e quebra nativa de linha garantida para o texto.
 */
export async function gerarPDFBuffer(texto: string): Promise<Uint8Array> {
  texto = markdownParaTexto(texto);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const margin = 40;
  
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - margin;

  // Quebra uma palavra longa caractere a caractere quando ultrapassa maxWidth
  const quebrarPalavraLonga = (palavra: string, maxWidth: number, isBold: boolean): string[] => {
    const selectedFont = isBold ? boldFont : font;
    const resultado: string[] = [];
    let pedaco = '';
    for (const char of palavra) {
      const teste = pedaco + char;
      if (selectedFont.widthOfTextAtSize(teste, fontSize) > maxWidth) {
        if (pedaco) resultado.push(pedaco);
        pedaco = char;
      } else {
        pedaco = teste;
      }
    }
    if (pedaco) resultado.push(pedaco);
    return resultado;
  };

  const quebrarLinha = (text: string, maxWidth: number, isBold: boolean) => {
    const palavras = text.split(' ');
    const formatadas: string[] = [];
    let linhaAtual = '';
    const selectedFont = isBold ? boldFont : font;

    for (const palavra of palavras) {
      if (!palavra) continue;

      // Palavra isolada já ultrapassa a largura → quebrar no nível de caractere
      if (selectedFont.widthOfTextAtSize(palavra, fontSize) > maxWidth) {
        if (linhaAtual) {
          formatadas.push(linhaAtual);
          linhaAtual = '';
        }
        const partes = quebrarPalavraLonga(palavra, maxWidth, isBold);
        // Todas menos a última viram linhas completas
        for (let i = 0; i < partes.length - 1; i++) {
          formatadas.push(partes[i]);
        }
        linhaAtual = partes[partes.length - 1] ?? '';
        continue;
      }

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
        maxWidth: width - margin * 2,
        wordBreaks: [' '],
      });
      y -= fontSize * 1.5;
    }
    y -= fontSize * 0.5; // Espaçamento extra após cada parágrafo
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function gerarPDFBase64(texto: string): Promise<string> {
  const pdfBytes = await gerarPDFBuffer(texto);
  return Buffer.from(pdfBytes).toString('base64');
}
