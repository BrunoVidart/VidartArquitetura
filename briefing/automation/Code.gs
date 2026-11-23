/**
 * VA ARQUITETURA E INTERIORES — AUTOMAÇÃO DE BRIEFINGS
 * Instalável em script.google.com (Apps Script).
 *
 * Entrada: POST do FormSubmit.co (_webhook) com {"form_data": {...}}.
 * Saída: e-mail HTML e PDF para o escritório; notificações opcionais pelo
 * WhatsApp Business Platform (Cloud API) a dois profissionais.
 *
 * NUNCA inclua tokens de WhatsApp ou segredos no HTML público ou no GitHub.
 * Configure os valores no painel "Propriedades do script".
 */

var VA_SECTIONS = [
  { title: "01. Perfil dos moradores", start: 1, end: 6 },
  { title: "02. Estilo e personalidade", start: 7, end: 13 },
  { title: "03. Conforto, segurança e acessibilidade", start: 14, end: 20 },
  { title: "04. Sala de estar e jantar", start: 21, end: 24 },
  { title: "05. Suítes | 03 dormitórios", start: 25, end: 29 },
  { title: "06. Banheiros das suítes", start: 30, end: 31 },
  { title: "07. Área gourmet", start: 32, end: 36 },
  { title: "08. Lavanderia", start: 37, end: 39 },
  { title: "09. Lavabo", start: 40, end: 41 },
  { title: "10. Espaço de massagem, recepção e banheiro", start: 42, end: 57 },
  { title: "11. Área externa e piscina", start: 58, end: 60 },
  { title: "12. Tecnologia e funcionalidade", start: 61, end: 62 },
  { title: "13. Investimento e expectativas", start: 63, end: 68 }
];

var VA_MAIL_TO = "vidart.arquitetura@gmail.com";
var VA_BRIEFING_LINK = "https://brunovidart.github.io/VidartArquitetura/briefing/";

function vaEscape(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function vaAnswer(value) {
  if (Array.isArray(value)) return value.join("; ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value == null ? "" : value);
}
function vaTrim(value, maxLen) {
  return String(value == null ? "" : value).trim().slice(0, maxLen || 4000);
}
function vaNormalize(payload) {
  var fields = payload && (payload.form_data || payload.data || payload);
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error("Corpo do webhook inválido.");
  }
  var name = vaTrim(fields.Nome || fields.nome || fields["Nome do cliente"], 160);
  if (!name) throw new Error("Nome do cliente ausente.");
  var found = {};
  Object.keys(fields).forEach(function (key) {
    var m = /^(\d{1,2})\s*[|—–-]\s*(.+)$/.exec(key);
    if (!m) return;
    var index = Number(m[1]);
    if (index < 1 || index > 68) return;
    found[index] = {number: index, label: vaTrim(m[2], 400), value: vaTrim(vaAnswer(fields[key]), 5000)};
  });
  var count = Object.keys(found).length;
  // Formulários anônimos aleatórios não devem disparar e-mails e WhatsApp.
  if (count < 60) throw new Error("Formulário incompleto ou não reconhecido.");
  var sections = VA_SECTIONS.map(function (section) {
    var questions = [];
    for (var n = section.start; n <= section.end; n++) {
      questions.push(found[n] || {number: n, label: "Pergunta " + n, value: "Não informado"});
    }
    return { title: section.title, questions: questions };
  });
  var answered = sections.reduce(function (sum, s) {
    return sum + s.questions.filter(function(q) {
      return q.value && q.value !== "Não informado" && q.value !== "—";
    }).length;
  }, 0);
  return {
    name: name,
    contactEmail: vaTrim(fields["E-mail do cliente"] || "", 180),
    city: vaTrim(fields.Cidade || "", 120),
    receivedAt: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy 'às' HH:mm"),
    answered: answered, total: 68, sections: sections,
    privacy: vaTrim(fields["Ciência do aviso LGPD"] || "Não informado", 100),
    sensitive: vaTrim(fields["Autorização específica para dados de acessibilidade"] || "Não informado", 100)
  };
}

function vaSectionRows(section, pdf) {
  var result = "";
  section.questions.forEach(function (q) {
    var value = q.value || "Não informado";
    result += '<tr><td style="padding:12px 16px;border-bottom:1px solid #eeeae3;vertical-align:top;">'
      + '<div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#514c45;font-weight:600;">'
      + q.number + '. ' + vaEscape(q.label) + '</div>'
      + '<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;padding-top:6px;color:'
      + (value === "Não informado" ? "#9b958b" : "#534c43")
      + ';word-wrap:break-word;white-space:pre-wrap;">' + vaEscape(value) + '</div></td></tr>';
  });
  return result;
}

function vaReportHtml(data, pdf) {
  var sectionsHtml = data.sections.map(function (section) {
    return '<table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;margin:0 0 20px;">'
      + '<thead><tr><th style="text-align:left;background:#f1eee8;padding:13px 16px;font:600 13px Arial,sans-serif;color:#756b5e;letter-spacing:.3px;">'
      + vaEscape(section.title) + '</th></tr></thead><tbody>' + vaSectionRows(section, pdf) + '</tbody></table>';
  }).join("");
  return '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"></head>'
    + '<body style="margin:0;padding:0;background:#f9f7f3;color:#413d36;">'
    + '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f9f7f3;"><tr><td align="center" style="padding:24px 12px;">'
    + '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:690px;width:100%;background:#fff;border:1px solid #e8e2d8;">'
    + '<tr><td align="center" style="background:#f6f3ee;padding:35px 24px 26px;">'
    + '<div style="font-family:Georgia,serif;font-size:56px;font-weight:400;line-height:1;color:#817969;letter-spacing:-5px;">VA</div>'
    + '<div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#817969;padding-top:7px;">ARQUITETURA E INTERIORES</div>'
    + '<div style="font-family:Georgia,serif;font-size:29px;line-height:1.3;color:#635b4f;padding-top:28px;">Briefing recebido</div>'
    + '<div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#7c7469;padding-top:8px;">'
    + 'Respostas organizadas por ambiente · ' + vaEscape(data.receivedAt) + '</div></td></tr>'
    + '<tr><td style="padding:27px 27px 15px;">'
    + '<div style="font:600 12px Arial,sans-serif;color:#84796b;letter-spacing:.5px;">DADOS DO PROJETO</div>'
    + '<table role="presentation" style="width:100%;border-collapse:collapse;margin:10px 0 24px;">'
    + '<tr><td style="padding:7px 0;font:13px Arial;color:#7d756b;">Cliente</td><td style="padding:7px 0;font:600 14px Arial;color:#3d3933;text-align:right;">' + vaEscape(data.name) + '</td></tr>'
    + '<tr><td style="padding:7px 0;font:13px Arial;color:#7d756b;">E-mail</td><td style="padding:7px 0;font:13px Arial;color:#625b50;text-align:right;">' + vaEscape(data.contactEmail || "Não informado") + '</td></tr>'
    + '<tr><td style="padding:7px 0;font:13px Arial;color:#7d756b;">Cidade</td><td style="padding:7px 0;font:13px Arial;color:#625b50;text-align:right;">' + vaEscape(data.city || "Não informada") + '</td></tr>'
    + '<tr><td style="padding:7px 0;font:13px Arial;color:#7d756b;">Preenchimento</td><td style="padding:7px 0;font:600 13px Arial;color:#625b50;text-align:right;">' + data.answered + ' de ' + data.total + ' respostas</td></tr>'
    + '</table>'
    + '<div style="font:600 12px Arial,sans-serif;letter-spacing:.5px;color:#84796b;margin:0 0 15px;">BRIEFING COMPLETO · 13 AMBIENTES E TEMAS</div>'
    + sectionsHtml
    + '<div style="font:12px/1.7 Arial,sans-serif;color:#827a70;margin-top:25px;padding-top:15px;border-top:1px solid #e5dfd5;">'
    + 'Aviso LGPD: ' + vaEscape(data.privacy) + ' · Dados de acessibilidade: ' + vaEscape(data.sensitive)
    + '<br/>Arquivo confidencial para uso interno da VA Arquitetura e Interiores.</div>'
    + '</td></tr></table></td></tr></table></body></html>';
}

function vaPdf(data) {
  // A conversão é feita no servidor; não precisa instalar bibliotecas no navegador.
  return HtmlService.createHtmlOutput(vaReportHtml(data, true))
    .getAs("application/pdf")
    .setName("VA_Briefing_" + data.name.replace(/[^\p{L}\p{N}_ -]/gu, "").replace(/\s+/g,"_").slice(0,55) + ".pdf");
}

function vaSendEmail(data) {
  var pdf = vaPdf(data);
  var subject = "VA | Novo briefing recebido — " + data.name;
  var body = "Novo briefing VA recebido de " + data.name
    + " em " + data.receivedAt + ".\n"
    + "Confira as respostas organizadas neste e-mail e no PDF anexado.";
  MailApp.sendEmail({
    to: VA_MAIL_TO,
    subject: subject,
    body: body,
    name: "VA Arquitetura e Interiores",
    htmlBody: vaReportHtml(data, false),
    attachments: [pdf]
  });
}

/**
 * Envia APENAS aviso operacional, SEM dados pessoais do cliente.
 * Depende de conta WhatsApp Business Platform / Cloud API,
 * token, número remetente autorizado e template utilitário APROVADO.
 *
 * Script Properties:
 * WA_ACCESS_TOKEN
 * WA_PHONE_NUMBER_ID
 * WA_RECIPIENTS (dois telefones, dígitos com DDI, separados por vírgula)
 * WA_TEMPLATE_NAME (ex: va_novo_briefing)
 * WA_TEMPLATE_LANGUAGE (ex: pt_BR)
 * WA_GRAPH_VERSION (ex: v27.0)
 */
function vaNotifyWhatsApp() {
  var properties = PropertiesService.getScriptProperties();
  var token = properties.getProperty("WA_ACCESS_TOKEN");
  var phoneId = properties.getProperty("WA_PHONE_NUMBER_ID");
  var recipients = (properties.getProperty("WA_RECIPIENTS") || "")
    .split(",").map(function(n){ return n.replace(/\D/g, ""); }).filter(Boolean);
  var template = properties.getProperty("WA_TEMPLATE_NAME");
  var lang = properties.getProperty("WA_TEMPLATE_LANGUAGE") || "pt_BR";
  var graphVersion = properties.getProperty("WA_GRAPH_VERSION") || "v27.0";
  if (!token || !phoneId || !template || recipients.length !== 2) {
    return { status: "not_configured", attempted: 0, sent: 0 };
  }
  var sent = 0, errors = [];
  recipients.forEach(function (to) {
    var body = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: { name: template, language: { code: lang } }
    };
    try {
      var response = UrlFetchApp.fetch(
        "https://graph.facebook.com/" + encodeURIComponent(graphVersion)
          + "/" + encodeURIComponent(phoneId) + "/messages",
        { method: "post", contentType: "application/json",
          headers: { Authorization: "Bearer " + token },
          payload: JSON.stringify(body), muteHttpExceptions: true }
      );
      var status = response.getResponseCode();
      if (status < 200 || status >= 300) throw new Error("HTTP " + status);
      sent++;
    } catch (ex) {
      // Não registra o token nem o telefone completo em logs.
      errors.push("Falha na notificação de um destinatário: " + String(ex.message || ex));
    }
  });
  if (errors.length) console.error(errors.join("\n"));
  return { status: sent === 2 ? "sent" : "partial_or_failed", attempted: 2, sent: sent };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return vaJson({ok:false,error:"Processamento ocupado; tente novamente."});
  }
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("POST sem dados");
    var data = vaNormalize(JSON.parse(e.postData.contents));
    var props = PropertiesService.getScriptProperties();
    var expected = props.getProperty("WEBHOOK_TOKEN");
    // Se configurado, o token deve estar na URL do webhook em FormSubmit.
    // Atenção: token em _webhook no HTML público NÃO deve ser considerado segredo.
    if (expected && (!e.parameter || e.parameter.token !== expected)) {
      throw new Error("Webhook não autorizado");
    }
    var cache = CacheService.getScriptCache();
    var signature = Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
      e.postData.contents)
    ).slice(0,50);
    if (cache.get(signature)) return vaJson({ok:true,duplicate:true});
    vaSendEmail(data);
    cache.put(signature, "1", 21600);
    var notice = vaNotifyWhatsApp();
    return vaJson({ok:true,email:"sent",whatsapp:notice.status,whatsappSent:notice.sent});
  } catch (error) {
    console.error("Erro de processamento de briefing: " + String(error.message || error));
    return vaJson({ok:false,error:"Não foi possível processar o briefing."});
  } finally {
    lock.releaseLock();
  }
}
function vaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  return ContentService.createTextOutput("Integração privada VA — acesso apenas por webhook.")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Configuração sem disparar envios, útil para conferir antes de ativar.
function vaVerificarConfiguracao() {
  var p = PropertiesService.getScriptProperties();
  var connected = ["WA_ACCESS_TOKEN","WA_PHONE_NUMBER_ID","WA_TEMPLATE_NAME","WA_RECIPIENTS"]
    .every(function(k){return !!p.getProperty(k);});
  var result = {emailDestino:VA_MAIL_TO, whatsappConfigurado:connected};
  console.log(JSON.stringify(result));
  return result;
}

// Teste local do layout: NUNCA envia mensagens.
function vaTesteRenderizacao() {
  var field = {"Nome":"Cliente Exemplo","E-mail do cliente":"teste@exemplo.com","Cidade":"Exemplo"};
  for (var i = 1; i <= 68; i++) field[String(i).padStart(2,"0")+" | Pergunta exemplo "+i] = i%3 ? "Preferência demonstrativa" : "Não informado";
  var data=vaNormalize({form_data:field});
  return {subject:"VA | Novo briefing recebido — "+data.name,htmlCharacters:vaReportHtml(data,false).length,pdfName:vaPdf(data).getName()};
}
