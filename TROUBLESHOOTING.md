# Guia de Problemas e Soluções — FIEC Inscrições

Este guia cobre os problemas mais comuns que podem ocorrer e o que fazer em cada caso.

---

## 🔴 CRÍTICO — Polos sumiram do admin após F5

**Sintoma:** Polos desaparecem ao recarregar o painel admin.

**Causa:** O polo foi criado mas `polosStatus` não foi salvo no Edge Config.

**Solução:**
1. Acessa o painel admin
2. Clica em **↓ Restaurar emergência**
3. Os polos voltam da planilha master

**Prevenção:** Sempre clicar em **↑ Fazer backup agora** após criar ou alterar polos.

---

## 🔴 CRÍTICO — Edge Config perdeu todos os dados

**Sintoma:** Painel admin abre mas não mostra nenhum polo. Polos mostram "Nenhuma turma disponível".

**Causa:** Edge Config foi sobrescrito acidentalmente ou expirou (improvável mas possível).

**Solução:**
1. Acessa o painel admin (`https://admin-fiec.vercel.app/index.html`)
2. Faz login normalmente
3. Clica em **↓ Restaurar emergência**
4. Confirma a operação
5. Aguarda a mensagem de sucesso
6. Clica em **↑ Fazer backup agora** para confirmar que está tudo salvo

**Se o restaurar emergência também falhar:**
1. Abre a planilha master no Google Sheets
2. Vai na aba **Turmas** — verifica se tem dados
3. Se tiver dados, o problema é na conexão com o Apps Script
4. Verifica se a variável `APPS_SCRIPT_MASTER_URL` está correta no Vercel (Settings → Environment Variables)

---

## 🟡 MÉDIO — Polo mostra "Erro ao carregar turmas"

**Sintoma:** A página do polo abre mas aparece "Erro ao carregar turmas. Tente novamente."

**Causa 1:** API do Vercel fora do ar.
**Solução 1:** Acessa `https://admin-fiec.vercel.app/api/switch` diretamente. Se retornar erro, o Vercel está com problema. Aguarda alguns minutos e tenta novamente.

**Causa 2:** Edge Config sem dados.
**Solução 2:** Faz o restaurar emergência conforme descrito acima.

**Causa 3:** Polo foi deletado do admin.
**Solução 3:** Recria o polo no admin com o mesmo ID.

---

## 🟡 MÉDIO — Admin não carrega / botões não funcionam

**Sintoma:** Painel admin abre mas botões não respondem, incluindo o botão Sair.

**Causa:** Erro de JavaScript no `admin.html` — geralmente causado por caracteres especiais em strings.

**Solução:**
1. Abre o console do navegador (F12 → Console)
2. Procura pela mensagem de erro
3. Reporta o erro para o desenvolvedor

**Solução temporária:**
1. Limpa o localStorage: F12 → Console → digita `localStorage.clear()` → Enter
2. Recarrega a página (F5)
3. Faz login novamente

---

## 🟡 MÉDIO — Inscrições abertas mas aluno não consegue clicar nas turmas

**Sintoma:** Switch mostra "Aberto" no admin mas os cards das turmas ficam bloqueados.

**Causa 1:** Polling de 30 segundos ainda não atualizou.
**Solução 1:** Aguarda 30 segundos ou recarrega a página do polo.

**Causa 2:** O polo específico está fechado mesmo com switch geral aberto.
**Solução 2:** Verifica no admin se o polo está com status **🔓 Aberto** (verde).

**Causa 3:** A turma específica está fechada individualmente.
**Solução 3:** Abre o modal de turmas no admin e verifica se as turmas estão com **🔓**.

---

## 🟡 MÉDIO — Planilha com linhas duplicadas no backup

**Sintoma:** A aba Turmas da planilha master mostra as mesmas turmas várias vezes.

**Causa:** O backup foi chamado múltiplas vezes em sequência.

**Solução:** O backup limpa a planilha antes de escrever (`clearContents`), então o próximo backup corrige automaticamente. Clica em **↑ Fazer backup agora** para forçar uma limpeza.

---

## 🟡 MÉDIO — Deploy do Vercel travado em "Initializing" ou "Queued"

**Sintoma:** Após subir arquivos no GitHub, o Vercel fica travado sem deployar.

**Causa:** Fila do Vercel sobrecarregada ou problema temporário.

**Solução:**
1. Cancela todos os deploys pendentes no painel do Vercel
2. Vai em **Deployments** → acha o último commit → clica nos 3 pontinhos → **Redeploy**
3. Se ainda não funcionar, faz uma alteração mínima no GitHub (ex: adiciona um espaço em qualquer arquivo e commita) para forçar novo deploy

---

## 🟢 MENOR — Polo mostra ID em vez do nome (ex: "polo-fiec" em vez de "Polo FIEC")

**Sintoma:** Nome do polo aparece como o ID (`polo-fiec`, `polo-ceu` etc).

**Causa:** O nome não foi salvo no Edge Config.

**Solução:**
1. Abre o painel admin
2. Clica em **Turmas** no card do polo
3. Clica no botão **📍**
4. Preenche o nome correto e endereço
5. Clica em **Salvar**

---

## 🟢 MENOR — URL do polo retorna 404 no Google Sites

**Sintoma:** Página do polo mostra erro 404.

**Causa:** URL incorporada no Google Sites está errada (com `/public/` na frente por exemplo).

**Solução:** A URL correta é:
```
https://admin-fiec.vercel.app/polo.html?id=POLO_ID
```
**Não usar:**
```
https://admin-fiec.vercel.app/public/polo.html?id=POLO_ID  ← ERRADO
```

---

## 🟢 MENOR — Backup não atualiza aba Polos

**Sintoma:** Aba Polos na planilha não aparece ou não atualiza com polos novos.

**Causa:** Apps Script master não tem o código de `backupPolos` atualizado.

**Solução:**
1. Abre o Apps Script master
2. Verifica se existe o bloco `if (dados.tipo === 'backupPolos')`
3. Se não existir, cola o código do arquivo `apps-script-master.js` mais recente
4. Salva (não precisa reimplantar)
5. Clica em **↑ Fazer backup agora** no admin

---

## 🟢 MENOR — Restaurar emergência remove polos que não estavam na planilha

**Sintoma:** Após restaurar emergência, polos criados recentemente somem.

**Causa:** A planilha estava desatualizada — o backup não tinha sido feito após criar os polos.

**Solução:** Não tem como recuperar automaticamente. Recria os polos manualmente no admin:
1. Clica em **+ Criar polo** com o mesmo ID, nome e endereço
2. Abre o modal de turmas e adiciona as turmas novamente
3. Clica em **↑ Fazer backup agora** para salvar

**Prevenção:** Sempre fazer backup após qualquer alteração importante.

---

## 📋 Checklist para o Dia das Inscrições

Antes de abrir as inscrições:

- [ ] Verificar se todas as turmas têm o **link do Google Forms** preenchido
- [ ] Verificar se os Forms estão **aceitando respostas**
- [ ] Clicar em **↑ Fazer backup agora** para salvar o estado atual
- [ ] Testar um polo abrindo a URL diretamente no navegador
- [ ] Abrir as inscrições no admin (botão **✓ Abrir inscrições**)
- [ ] Verificar se os polos estão respondendo (aguardar o polling de 30s)

Para fechar as inscrições:

- [ ] Clicar em **✕ Fechar inscrições** no admin
- [ ] Confirmar que os polos estão bloqueados (verificar em outro dispositivo)
- [ ] Clicar em **↑ Fazer backup agora**

---

## 📞 Contatos e Recursos

| Recurso | Link |
|---|---|
| Painel Admin | `https://admin-fiec.vercel.app/index.html` |
| Repositório GitHub | `https://github.com/Razante21/switch` |
| Painel Vercel | `https://vercel.com/razantes-projects/switch` |
| Edge Config | `https://vercel.com/razantes-projects/~/stores/edge-config` |
| Planilha Master | Google Drive · FIEC |

---

*Última atualização: Maio 2026*
