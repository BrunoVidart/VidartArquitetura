# Automação de briefings — VA Arquitetura e Interiores

**Estado atual: código preparado, ainda NÃO ativado nas contas Google ou Meta.** O briefing público mantém o envio original pelo FormSubmit.co até a ativação.

## Entregas após configurar

- E-mail visual para **vidart.arquitetura@gmail.com**, com 13 seções e 68 perguntas agrupadas por ambiente.
- PDF completo anexado ao e-mail.
- Aviso operacional pelo WhatsApp Business para Bruno Vidart e Josielly Vidart. A mensagem NÃO contém nome nem dados do cliente.
- Confirmação e agradecimento na página do cliente.

Arquivos:
- [Code.gs](Code.gs): automação Google Apps Script.
- [exemplo-email.html](exemplo-email.html): prévia visual fictícia do e-mail.
- [../index.html](../index.html): briefing público com integração opcional preparada.

## Ativação do Gmail

1. Entre em https://script.google.com usando a conta **vidart.arquitetura@gmail.com**.
2. Crie o projeto **VA — Recebimento de Briefings**.
3. Copie todo o conteúdo de [Code.gs](Code.gs) para o editor.
4. Configure o fuso horário America/Sao_Paulo.
5. Execute a função de teste **vaTesteRenderizacao** (gera PDF fictício, sem enviar mensagens) e autorize os acessos Google solicitados.
6. Execute **vaVerificarConfiguracao** (somente consulta configuração).
7. Publique: **Implantar > Nova implantação > Aplicativo da Web**, executar como você. A opção de acesso **Qualquer pessoa** cria um endpoint público e só deve ser usada após revisão de segurança. Copie a URL terminada em /exec.

## Ativação do webhook FormSubmit.co

1. Confirme no Gmail da VA que o FormSubmit.co já foi ativado.
2. O site envia atualmente para https://formsubmit.co/ajax/vidart.arquitetura@gmail.com .
3. No arquivo [../index.html](../index.html), procure **VA_AUTOMATION_WEBHOOK_URL**. A variável está vazia por segurança.
4. Após validar o endpoint, coloque nela a URL /exec do Apps Script.
5. O formulário enviará automaticamente um campo **_webhook** ao FormSubmit.co. O serviço encaminhará a submissão para o Apps Script, que produzirá e-mail HTML e PDF.
6. Faça um envio com dados fictícios e confirme o recebimento das duas mensagens: a mensagem original do FormSubmit e a mensagem organizada da VA.
7. Opcionalmente configure filtros no Gmail para arquivar a mensagem original e manter a visual.

**Segurança:** um Web App Apps Script público não valida por padrão a assinatura criptográfica do webhook. O código exige a estrutura esperada e elimina duplicatas temporárias, mas isso NÃO substitui autenticação forte, proteção contra spam e revisão LGPD. Para operação com dados sensíveis recomenda-se validar a origem por assinatura em um backend adequado antes de publicar.

## Ativação dos dois avisos WhatsApp

Esta automação utiliza **WhatsApp Business Platform Cloud API**, não links simples de WhatsApp. É necessário ter conta Meta Business, um número remetente habilitado, token de acesso e um **modelo utilitário aprovado** pela Meta.

Modelo sugerido, sem informações pessoais do cliente:

> VA Arquitetura e Interiores: recebemos um novo briefing. Confira o e-mail do escritório.

Na conta Google Apps Script, configure as **Propriedades do script**:

- **WA_ACCESS_TOKEN**: token da Meta (privado).
- **WA_PHONE_NUMBER_ID**: ID do número remetente.
- **WA_RECIPIENTS**: os dois números dos responsáveis com DDI, somente dígitos, separados por vírgula.
- **WA_TEMPLATE_NAME**: nome exato do modelo aprovado, por exemplo va_novo_briefing.
- **WA_TEMPLATE_LANGUAGE**: pt_BR.
- **WA_GRAPH_VERSION**: v27.0 (ou versão suportada).

Não coloque tokens nem os números pessoais dos responsáveis neste repositório público. Os números de Bruno e Josielly foram fornecidos na conversa; basta informá-los nas propriedades quando a conta Meta for conectada.

Se o WhatsApp não estiver configurado, o e-mail e o PDF continuam funcionando, **mas os avisos não são enviados**. A Meta pode cobrar tarifas e exigir aceites e aprovações.

## Checklist de teste

1. Enviar formulário com dados fictícios.
2. Confirmar mensagem original do FormSubmit na caixa VA.
3. Confirmar e-mail visual VA e PDF com 13 seções, 68 perguntas e espaço de massagem.
4. Confirmar recebimento dos avisos pelos dois WhatsApps (após ativação Meta).
5. Consultar a área **Execuções** no Apps Script em caso de falha.

## Privacidade

O briefing pode incluir informações sensíveis (mobilidade e saúde). Restrinja acesso, defina retenção e exclusão, revise bases legais e contrato com prestadores, e envie ao WhatsApp apenas aviso operacional, nunca respostas do cliente.

Referências: [Apps Script Web Apps](https://developers.google.com/apps-script/guides/web), [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app), [PDF HtmlOutput](https://developers.google.com/apps-script/reference/html/html-output), [FormSubmit.co](https://formsubmit.co/documentation) e [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/).
