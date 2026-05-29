'use client';

import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface ContratoPreviewProps {
  conteudo: string;
}

export function ContratoPreview({ conteudo }: ContratoPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const resultado = marked.parse(conteudo, { breaks: true, gfm: true }) as string;
    setHtml(resultado);
  }, [conteudo]);

  return (
    <div
      className="contrato-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
