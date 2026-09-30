# Sorteio Spaço Mãe e Bebê — Kids Run 2026

Landing page responsiva e sem dependências para cadastro no sorteio.

## Publicação

Os arquivos podem ser publicados diretamente em qualquer hospedagem estática.

## Integração com Google Sheets

1. Crie uma planilha com as colunas: `dataHora`, `responsavel`, `whatsapp`, `email`, `crianca`, `idade`, `fase`, `interesses`, `participaSorteio`, `autorizouComunicacao`, `visita` e `origem`.
2. Abra **Extensões → Apps Script** e cole o conteúdo de `google-apps-script.gs`.
3. Publique o script como aplicativo da web com acesso público.
4. Cole a URL publicada em `FORM_ENDPOINT`, no início de `script.js`.

Sem endpoint configurado, a página funciona em modo de demonstração e mostra o fluxo completo sem persistir dados.
