// ============================================================
//  SCRIPT DA PLANILHA DE RESPOSTAS – FIEC Educação Digital
//  Cole este código em cada planilha vinculada ao Google Forms
//  Extensões > Apps Script > cola o código > salva (Ctrl+S)
//
//  GATILHO OBRIGATÓRIO:
//  Acionadores > Adicionar acionador
//    Função:  formatarEVerificarTudo
//    Origem:  Da planilha
//    Tipo:    Ao enviar formulário
// ============================================================

// Coluna onde está o NOME do aluno (padrão: coluna B = 2)
var COL_NOME = 2;

// Coluna onde está a DATA DE NASCIMENTO (padrão: coluna C = 3)
var COL_DATA_NASC = 3;

// Número de colunas do formulário (para pintar a linha inteira)
var NUM_COLUNAS = 13;

// ── FORMATAR E VERIFICAR ──────────────────────────────────────
function formatarEVerificarTudo(e) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var aba  = ss.getSheets()[0];
  var linha = e.range.getRow();

  // 1. FORMATAR NOME EM MAIÚSCULO
  var celulaNome   = aba.getRange(linha, COL_NOME);
  var nomeOriginal = celulaNome.getValue();
  if (typeof nomeOriginal === 'string') {
    celulaNome.setValue(nomeOriginal.toUpperCase().trim());
  }

  // 2. VERIFICAR IDADE
  var dataNascRaw = aba.getRange(linha, COL_DATA_NASC).getValue();
  var dataNasc    = new Date(dataNascRaw);

  if (isNaN(dataNasc.getTime())) return;

  var hoje  = new Date();
  var idade = hoje.getFullYear() - dataNasc.getFullYear();
  var m     = hoje.getMonth() - dataNasc.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }

  // 3. PINTAR LINHA SE MENOR DE 12 ANOS
  if (idade < 12) {
    aba.getRange(linha, 1, 1, NUM_COLUNAS).setBackground('#ff4d4d');
    aba.getRange(linha, NUM_COLUNAS + 1).setValue('MENOR DE 12 ANOS (Idade: ' + idade + ')');
  } else {
    aba.getRange(linha, 1, 1, NUM_COLUNAS).setBackground(null);
    aba.getRange(linha, NUM_COLUNAS + 1).clearContent();
  }
}
