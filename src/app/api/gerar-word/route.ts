import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  Header,
  Footer,
  PageNumber,
  BorderStyle,
} from "docx";

export const maxDuration = 30;

// Converte markdown do contrato em elementos docx
function markdownParaDocx(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const linhas = markdown.split("\n");

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];

    // Linha em branco → espaçamento
    if (linha.trim() === "") {
      paragraphs.push(new Paragraph({ children: [], spacing: { after: 60 } }));
      continue;
    }

    // Separador ---
    if (/^---+$/.test(linha.trim())) {
      paragraphs.push(
        new Paragraph({
          children: [],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } },
          spacing: { after: 120 },
        })
      );
      continue;
    }

    // ## Título de seção (H2)
    if (linha.startsWith("## ")) {
      const texto = linha.replace(/^## /, "").trim();
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: texto, bold: true, color: "002B73" })],
          spacing: { before: 280, after: 120 },
        })
      );
      continue;
    }

    // # Título principal (H1)
    if (linha.startsWith("# ")) {
      const texto = linha.replace(/^# /, "").trim();
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: texto, bold: true, color: "001848", size: 32 })],
          spacing: { before: 0, after: 280 },
        })
      );
      continue;
    }

    // Item de lista - ou *
    if (/^[-*]\s+/.test(linha)) {
      const texto = linha.replace(/^[-*]\s+/, "").trim();
      paragraphs.push(
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: parsearInline(texto),
          spacing: { after: 80 },
        })
      );
      continue;
    }

    // Parágrafo normal
    paragraphs.push(
      new Paragraph({
        children: parsearInline(linha.trim()),
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  return paragraphs;
}

// Parseia negrito (**texto**) e itálico (*texto*) inline
function parsearInline(texto: string): TextRun[] {
  const runs: TextRun[] = [];
  // Regex captura **negrito**, *itálico* e texto normal
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|([^*]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    if (match[1]) {
      runs.push(new TextRun({ text: match[1], bold: true }));
    } else if (match[2]) {
      runs.push(new TextRun({ text: match[2], italics: true }));
    } else if (match[3]) {
      runs.push(new TextRun({ text: match[3] }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text: texto })];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conteudo: string = body?.conteudo;

    if (!conteudo || typeof conteudo !== "string") {
      return NextResponse.json({ error: "Conteúdo obrigatório." }, { status: 400 });
    }

    const paragrafos = markdownParaDocx(conteudo);

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "bullets",
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: "•",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: { indent: { left: 720, hanging: 360 } },
                },
              },
            ],
          },
        ],
      },
      styles: {
        default: {
          document: { run: { font: "Calibri", size: 24 } }, // 12pt
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { size: 32, bold: true, font: "Calibri", color: "001848" },
            paragraph: { spacing: { before: 0, after: 280 }, outlineLevel: 0 },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { size: 26, bold: true, font: "Calibri", color: "002B73" },
            paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 11906, height: 16838 }, // A4
              margin: { top: 1701, right: 1134, bottom: 1701, left: 1134 }, // ~3cm / 2cm
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "ContratoFácil",
                      bold: true,
                      color: "002B73",
                      size: 18,
                      font: "Calibri",
                    }),
                    new TextRun({
                      text: "  —  Um produto FlowIQ",
                      color: "888888",
                      size: 16,
                      font: "Calibri",
                    }),
                  ],
                  border: {
                    bottom: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD", space: 1 },
                  },
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Página ", color: "888888", size: 18, font: "Calibri" }),
                    new TextRun({ children: [PageNumber.CURRENT], color: "888888", size: 18, font: "Calibri" }),
                    new TextRun({ text: " de ", color: "888888", size: 18, font: "Calibri" }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], color: "888888", size: 18, font: "Calibri" }),
                  ],
                  border: {
                    top: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD", space: 1 },
                  },
                }),
              ],
            }),
          },
          children: paragrafos,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="contrato.docx"`,
      },
    });
  } catch (error: unknown) {
    console.error("[gerar-word]", error);
    return NextResponse.json({ error: "Erro ao gerar arquivo Word." }, { status: 500 });
  }
}
