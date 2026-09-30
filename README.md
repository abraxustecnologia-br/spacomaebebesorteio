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

## Display A4 e QR Code

Abra `display-a4.html` no navegador e use **Ctrl + P → Salvar como PDF**. Selecione papel A4, escala 100%, margens "nenhuma" e habilite os gráficos de plano de fundo.

O QR estático em `assets/qr-code.svg` aponta diretamente para a página publicada e não depende de serviço de redirecionamento.
