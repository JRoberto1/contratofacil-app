'use client';

import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface ContratoPreviewProps {
  conteudo: string;
}

export function ContratoPreview({ conteudo }: ContratoPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Configurar o marked para output seguro e limpo
    marked.setOptions({
      breaks: true,      // quebras de linha viram <br>
      gfm: true,         // GitHub Flavored Markdown
    });

    const resultado = marked(conteudo) as string;
    setHtml(resultado);
  }, [conteudo]);

  return (
    <div
      className="contrato-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
