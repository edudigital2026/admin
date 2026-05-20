# Sistema de Inscrições Digitais — FIEC

Programa de Educação Digital · II Semestre 2026

---

## Índice

- [Visão Geral](#visão-geral)
- [URLs Importantes](#urls-importantes)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Edge Config — Estrutura dos Dados](#edge-config--estrutura-dos-dados)
- [Painel Admin — O que cada coisa faz](#painel-admin--o-que-cada-coisa-faz)
- [Google Apps Script](#google-apps-script)
- [Variáveis de Ambiente](#variáveis-de-ambiente-vercel)
- [IDs dos Polos](#ids-dos-polos)
- [Como Adicionar um Polo Novo](#como-adicionar-um-polo-novo)
- [Como o Google Sites está configurado](#como-o-google-sites-está-configurado)
- [Fluxo de Inscrição](#fluxo-de-inscrição)
- [Configuração do Zero](#configuração-do-zero-novo-github--novo-vercel)
- [Checklist para o Dia das Inscrições](#checklist-para-o-dia-das-inscrições)
- [Problemas e Soluções](#problemas-e-soluções)

---

## Visão Geral

O sistema gerencia as inscrições dos polos da FIEC através de três camadas:

- **Google Sites** — site público onde os alunos acessam e se inscrevem
- **Vercel** — hospeda os HTMLs dos polos e a API de controle
- **Edge Config (Vercel)** — banco de dados em tempo real com turmas, status e configurações
- **Google Apps Script** — backup automático na planilha master e processamento dos Forms

---

## URLs Importantes

| O que é | URL |
|---|---|
| Painel Admin | `https://admin-fiec.vercel.app/index.html` |
| Página inicial dos polos | `https://admin-fiec.vercel.app/inicio.html` |
| Template de polo | `https://admin-fiec.vercel.app/polo.html?id=polo-fiec` |
| API principal | `https://admin-fiec.vercel.app/api/switch` |
| API de restaurar | `https://admin-fiec.vercel.app/api/restore` |

---

## Estrutura do Repositório

**GitHub:** `https://github.com/edudigital2026/admin`

```
/
├── api/
│   ├── switch.js      ← API principal (lê/escreve Edge Config)
│   └── restore.js     ← Restaura turmas da planilha master
├── public/
│   ├── index.html     ← Página de login do admin
│   ├── admin.html     ← Painel de controle
│   ├── admin.css      ← Estilo do painel admin
│   ├── admin.js       ← Lógica do painel admin
│   ├── polo.html      ← Template genérico dos polos
│   └── inicio.html    ← Página inicial com cards dos polos
└── vercel.json
```

---

## Edge Config — Estrutura dos Dados

| Chave | O que guarda |
|---|---|
| `inscricoes` | `"ABERTO"` ou `"FECHADO"` — switch geral |
| `turmas` | `{ "polo-fiec": [{modulo, dias, horario, form, aberta}] }` |
| `polosStatus` | `{ "polo-fiec": true/false }` — aberto/fechado por polo |
| `nomes` | `{ "polo-fiec": "Polo FIEC" }` |
| `enderecos` | `{ "polo-fiec": "Av. Eng. Fábio..." }` |
| `esperaGlobal` | `true/false` — lista de espera aberta ou não |
| `configs` | `{ titulo, eyebrow, data24, data35, semestre, linkEspera }` |

---

## Painel Admin — O que cada coisa faz

### Visão Geral
- **Abrir/Fechar inscrições** → abre ou fecha todos os polos de uma vez
- **Abrir/Fechar lista de espera** → libera ou bloqueia o botão de lista de espera em todos os polos

### Polos e Turmas
- **🔓/🔒** no card do polo → abre ou fecha aquele polo individualmente
- **Turmas** → abre modal com as turmas cadastradas
- **📍** no modal → edita nome e endereço do polo
- **+ Turma** → adiciona nova turma com módulo, dias, horário e link do Forms
- **🔓/🔒** na turma → abre ou fecha aquela turma individualmente
- **✎** → edita turma
- **🗑** → remove turma
- **🔗 URL** → copia a URL do polo para colar no Google Sites
- **🗑 Deletar** → remove o polo permanentemente

### Configurações
Campos editáveis que atualizam automaticamente no site público:
- **Título das inscrições** — ex: "Inscrições 2026"
- **Cabeçalho** — ex: "Programa de Educação Digital · 2026"
- **Data do evento**
- **Início 2ª e 4ª feira**
- **Início 3ª e 5ª feira**
- **Semestre**
- **Link da Lista de Espera** — URL do Google Forms de lista de espera

### Backup
- **↑ Fazer backup agora** → envia o estado atual para a planilha master
- **↓ Restaurar emergência** → SOMENTE em emergência — sobrescreve o Edge Config com os dados da planilha

---

## Google Apps Script

### Planilha Master
**URL:** `https://script.google.com/macros/s/AKfycbwantxjG5yYVHNgWT_X7QUv7JdNfTCJfKC7rG_ohukGOpEOqKSriqgcgpxnSagIbxassQ/exec`

Abas da planilha master:

| Aba | O que guarda |
|---|---|
| `Turmas` | Backup de todas as turmas de todos os polos |
| `Polos` | Backup dos polos com ID, nome e endereço |
| `ListaEspera` | Inscrições na lista de espera |

### Script das Planilhas de Respostas
Arquivo: `script-planilha.js`

Cole em **cada planilha** vinculada ao Google Forms:
1. Abre a planilha → **Extensões → Apps Script**
2. Cola o código do arquivo `script-planilha.js`
3. Salva (Ctrl+S)
4. Vai em **Acionadores → Adicionar acionador**:
   - Função: `formatarEVerificarTudo`
   - Origem: Da planilha
   - Tipo de evento: Ao enviar formulário
5. Clica em Salvar

O que o script faz:
- Formata o nome do aluno em MAIÚSCULO automaticamente
- Pinta a linha de vermelho se o aluno tiver menos de 12 anos

---

## Variáveis de Ambiente (Vercel)

Configuradas em **Settings → Environment Variables** do projeto:

| Variável | O que é |
|---|---|
| `EDGE_CONFIG` | URL de conexão do Edge Config |
| `EDGE_CONFIG_ID` | ID do Edge Config (`ecfg_...`) |
| `EDGE_CONFIG_TOKEN` | Token de leitura do Edge Config |
| `VERCEL_TOKEN` | Token da API do Vercel (para escrita) |
| `SENHA_PAINEL` | Senha de acesso ao painel admin |
| `APPS_SCRIPT_MASTER_URL` | URL do Apps Script master |

---

## IDs dos Polos

| Nome | ID |
|---|---|
| Polo FIEC | `polo-fiec` |
| Polo CEU | `polo-ceu` |
| Polo Sol-Sol | `polo-sol-sol` |
| Polo Bem Viver | `polo-bem-viver` |
| Polo Casa da Providência | `polo-casa-da-providencia` |
| Polo Jardim Brasil | `polo-jd-brasil` |
| Polo Veredas | `polo-veredas` |
| Polo Comunidade Independente | `polo-comunidade-independente` |

---

## Como Adicionar um Polo Novo

1. Acessa o painel admin
2. Preenche **Nome**, **ID** (começando com `polo-`) e **Endereço**
3. Clica em **+ Criar polo**
4. Abre o modal de **Turmas** e adiciona as turmas com horários e link do Forms
5. Clica em **🔗 URL** para copiar a URL do polo
6. No Google Sites, adiciona uma nova página e incorpora a URL via iframe

---

## Como o Google Sites está configurado

Cada página de polo incorpora um iframe apontando para:
```
https://admin-fiec.vercel.app/polo.html?id=POLO_ID
```

A página inicial incorpora:
```
https://admin-fiec.vercel.app/inicio.html
```

---

## Fluxo de Inscrição

1. Aluno acessa o Google Sites
2. Vê a página inicial com os cards dos polos
3. Clica em um polo → abre `polo.html?id=polo-X`
4. O polo busca turmas e status do Edge Config via API
5. Se inscrições abertas → clica na turma → redireciona para o Google Forms
6. Formulário salva na planilha do polo
7. Apps Script formata o nome e verifica idade automaticamente

---

## Configuração do Zero (novo GitHub + novo Vercel)

### 1. GitHub — Criar o repositório
1. Acessa [github.com](https://github.com) e faz login
2. Clica em **New repository** → nome `switch` → **Private** → **Create**
3. Faz upload de todos os arquivos na estrutura correta

### 2. Vercel — Criar o projeto
1. Acessa [vercel.com](https://vercel.com) → **Add New → Project**
2. Seleciona o repositório `switch`
3. Clica em **Deploy**

### 3. Vercel — Criar o Edge Config
1. **Storage → Create → Edge Config** → nome `fiec-switch` → **Create**
2. Clica em **Projects → Connect** → seleciona o projeto → marca os 3 ambientes → **Connect**
3. Anota o **ID** (`ecfg_...`) e vai em **Tokens → Create Token** para pegar o token de leitura

### 4. Vercel — Token da API
1. Avatar → **Account Settings → Tokens → Create Token**
2. Nome: `fiec-admin` → **Create** → copia o token

### 5. Vercel — Variáveis de Ambiente
Em **Settings → Environment Variables** do projeto, adiciona:

| Nome | Valor |
|---|---|
| `EDGE_CONFIG` | `https://edge-config.vercel.com/ecfg_ID?token=TOKEN` |
| `EDGE_CONFIG_ID` | `ecfg_SEU_ID` |
| `EDGE_CONFIG_TOKEN` | token de leitura |
| `VERCEL_TOKEN` | token da API |
| `SENHA_PAINEL` | senha que quiser |
| `APPS_SCRIPT_MASTER_URL` | URL do Apps Script master |

Após adicionar, faz **Redeploy** do último deploy.

### 6. Domínio personalizado (opcional)
**Settings → Domains → Add Domain** → digita o domínio desejado

### 7. Apps Script Master
1. Abre a planilha master → **Extensões → Apps Script**
2. Cola o código do `apps-script-master.js`
3. Salva (Ctrl+S) — **não precisa reimplantar**
4. Vai em **Implantar → Nova implantação → App da Web → Acesso: Qualquer pessoa**
5. Copia a URL e coloca na variável `APPS_SCRIPT_MASTER_URL` do Vercel

### 8. Verificar
1. Acessa `https://SEU-DOMINIO.vercel.app/index.html`
2. Faz login → deve aparecer o painel
3. Se vazio → clica em **↓ Restaurar emergência**
4. Clica em **↑ Fazer backup agora**

### 9. Atualizar o Google Sites
Para cada polo, substitui a URL no iframe:
```
https://SEU-DOMINIO.vercel.app/polo.html?id=polo-fiec
```
Para a página inicial:
```
https://SEU-DOMINIO.vercel.app/inicio.html
```

### Se a URL mudar
Arquivos que precisam ser atualizados com a nova URL:
- `public/polo.html` → linha `const VERCEL_URL`
- `public/inicio.html` → linha `const VERCEL_URL`
- `public/admin.js` → linha `const API` e função `copiarUrl`
- Google Sites → URL de cada iframe

---

## Checklist para o Dia das Inscrições

**Antes de abrir:**
- [ ] Todas as turmas têm o link do Google Forms preenchido
- [ ] Os Forms estão aceitando respostas
- [ ] Clicar em **↑ Fazer backup agora**
- [ ] Testar um polo abrindo a URL diretamente
- [ ] Abrir as inscrições no admin

**Para fechar:**
- [ ] Clicar em **✕ Fechar inscrições**
- [ ] Confirmar que os polos estão bloqueados em outro dispositivo
- [ ] Clicar em **↑ Fazer backup agora**

---

## Problemas e Soluções

### 🔴 Polos sumiram do admin após F5
**Causa:** Polo criado mas `polosStatus` não foi salvo.
**Solução:** Clica em **↓ Restaurar emergência** — os polos voltam da planilha.

---

### 🔴 Edge Config perdeu todos os dados
**Causa:** Edge Config sobrescrito acidentalmente.
**Solução:**
1. Abre o painel admin → clica em **↓ Restaurar emergência**
2. Confirma → aguarda sucesso
3. Clica em **↑ Fazer backup agora**

Se o restaurar também falhar, verifica se `APPS_SCRIPT_MASTER_URL` está correto no Vercel.

---

### 🟡 Polo mostra "Erro ao carregar turmas"
**Causa 1:** API do Vercel fora do ar → aguarda alguns minutos.
**Causa 2:** Edge Config vazio → faz o restaurar emergência.
**Causa 3:** Polo deletado → recria no admin com o mesmo ID.

---

### 🟡 Admin não carrega / botões não funcionam
**Causa:** Erro de JavaScript no `admin.html`.
**Solução:**
1. Abre o console (F12 → Console) e anota o erro
2. Limpa o localStorage: `localStorage.clear()` no console
3. Recarrega e faz login novamente

---

### 🟡 Inscrições abertas mas aluno não consegue clicar
**Causa 1:** Polling de 30s ainda não atualizou → aguarda ou recarrega.
**Causa 2:** Polo específico está fechado → verifica no admin se o polo está **🔓 Aberto**.
**Causa 3:** Turma específica está fechada → abre o modal e verifica as turmas.

---

### 🟡 Deploy do Vercel travado
**Causa:** Fila do Vercel sobrecarregada.
**Solução:**
1. Cancela todos os deploys pendentes no Vercel
2. **Deployments → 3 pontinhos → Redeploy**
3. Ou faz uma alteração mínima no GitHub para forçar novo deploy

---

### 🟢 Polo mostra ID em vez do nome
**Causa:** Nome não salvo no Edge Config.
**Solução:** No admin → **Turmas** → **📍** → preenche nome e endereço → salva.

---

### 🟢 URL do polo retorna 404
**Causa:** URL com `/public/` na frente.
**Solução:** A URL correta é `https://admin-fiec.vercel.app/polo.html?id=POLO_ID` — sem `/public/`.

---

### 🟢 Backup não atualiza aba Polos
**Causa:** Apps Script master desatualizado.
**Solução:** Verifica se existe `if (dados.tipo === 'backupPolos')` no código. Se não, cola o `apps-script-master.js` atualizado e salva.

---

### 🟢 Restaurar emergência remove polos recentes
**Causa:** Backup não feito após criar os polos.
**Solução:** Recria os polos manualmente no admin e faz backup imediatamente.

---

*Desenvolvido por Pedro Santos (Razante21) · FIEC Indaiatuba · 2026*
