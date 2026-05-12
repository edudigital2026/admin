# Sistema de Inscrições Digitais — FIEC

Programa de Educação Digital · II Semestre 2026

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

## Estrutura do Repositório (GitHub: Razante21/switch)

```
/
├── api/
│   ├── switch.js      ← API principal (lê/escreve Edge Config)
│   └── restore.js     ← Restaura turmas da planilha master
├── public/
│   ├── index.html     ← Página de login do admin
│   ├── admin.html     ← Painel de controle
│   ├── polo.html      ← Template genérico dos polos
│   └── inicio.html    ← Página inicial com cards dos polos
└── vercel.json
```

---

## Edge Config — Estrutura dos Dados

O Edge Config armazena tudo em chaves JSON:

| Chave | O que guarda |
|---|---|
| `inscricoes` | `"ABERTO"` ou `"FECHADO"` — switch geral |
| `turmas` | `{ "polo-fiec": [{modulo, dias, horario, form, aberta}] }` |
| `polosStatus` | `{ "polo-fiec": true/false }` — aberto/fechado por polo |
| `nomes` | `{ "polo-fiec": "Polo FIEC" }` |
| `enderecos` | `{ "polo-fiec": "Av. Eng. Fábio..." }` |
| `esperaGlobal` | `true/false` — lista de espera aberta ou não |

---

## Painel Admin — O que cada coisa faz

### Switch Geral
- **Abrir inscrições** → abre todos os polos de uma vez
- **Fechar inscrições** → fecha todos os polos de uma vez

### Lista de Espera Global
- **Abrir espera** → libera o link de lista de espera em todos os polos
- **Fechar espera** → bloqueia o link de lista de espera

### Cards dos Polos
- **🔓 Aberto / 🔒 Fechado** → abre ou fecha inscrições só daquele polo
- **Turmas** → abre modal com as turmas do polo
- **🔗 URL** → copia a URL do polo para colar no Google Sites
- **🗑 Deletar** → remove o polo permanentemente

### Modal de Turmas
- **📍** → edita nome e endereço do polo
- **+ Turma** → adiciona nova turma
- **🔓/🔒** em cada turma → abre ou fecha aquela turma individualmente
- **✎** → edita turma
- **🗑** → remove turma

### Backup e Restaurar
- **↑ Fazer backup agora** → envia o estado atual para a planilha master (aba Turmas e aba Polos)
- **↓ Restaurar emergência** → SOMENTE em emergência — sobrescreve o Edge Config com os dados da planilha

---

## Google Apps Script — Planilha Master

URL: `https://script.google.com/macros/s/AKfycbwantxjG5yYVHNgWT_X7QUv7JdNfTCJfKC7rG_ohukGOpEOqKSriqgcgpxnSagIbxassQ/exec`

A planilha tem três abas:

| Aba | O que guarda |
|---|---|
| `Turmas` | Backup de todas as turmas de todos os polos |
| `Polos` | Backup dos polos com ID, nome e endereço |
| `ListaEspera` | Inscrições na lista de espera |
| `Config` | Configurações gerais |

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

Cada página de polo no Sites incorpora um iframe apontando para:
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
2. Vê a página inicial com os cards dos polos (`inicio.html`)
3. Clica em um polo → abre `polo.html?id=polo-X`
4. O polo busca turmas e status do Edge Config via API
5. Se inscrições abertas → clica na turma → redireciona para o Google Forms
6. Formulário salva na planilha do polo
7. Apps Script formata o nome e verifica idade

---

*Desenvolvido por Pedro Santos (Razante21) · FIEC Indaiatuba · 2026*

---

## Configuração do Zero (novo GitHub + novo Vercel)

Se precisar reconfigurar tudo em uma conta nova, siga esse passo a passo.

### 1. GitHub — Criar o repositório

1. Acessa [github.com](https://github.com) e faz login na conta da FIEC
2. Clica em **New repository**
3. Nome: `switch` (ou qualquer nome)
4. Deixa como **Private**
5. Clica em **Create repository**
6. Faz upload de todos os arquivos na estrutura correta:
```
api/switch.js
api/restore.js
public/index.html
public/admin.html
public/polo.html
public/inicio.html
vercel.json
package.json
```

---

### 2. Vercel — Criar a conta e o projeto

1. Acessa [vercel.com](https://vercel.com) e cria conta com o GitHub da FIEC
2. Clica em **Add New → Project**
3. Seleciona o repositório `switch` criado no passo anterior
4. Clica em **Deploy** (não muda nada nas configurações por enquanto)
5. Aguarda o deploy terminar
6. O Vercel vai criar uma URL automática tipo `switch-xxx.vercel.app`

---

### 3. Vercel — Criar o Edge Config

1. No painel do Vercel, vai em **Storage → Create → Edge Config**
2. Nome: `fiec-switch`
3. Clica em **Create**
4. Após criar, clica em **Projects** no menu lateral
5. Seleciona o projeto `switch` e clica em **Connect**
6. Marca os 3 ambientes (Development, Preview, Production) e clica em **Connect**
7. Vai em **Items** e adiciona manualmente o item inicial:
   - Chave: `inscricoes`
   - Valor: `ABERTO`
8. Anota o **ID** do Edge Config (começa com `ecfg_`) — vai usar em breve
9. Clica em **Tokens → Create Token** e anota o token gerado

---

### 4. Vercel — Criar o Token da API

1. Clica no avatar no canto superior direito → **Account Settings**
2. Vai em **Tokens → Create Token**
3. Nome: `fiec-admin`
4. Clica em **Create** e anota o token gerado

---

### 5. Vercel — Configurar as Variáveis de Ambiente

1. No projeto `switch`, vai em **Settings → Environment Variables**
2. Adiciona cada variável abaixo:

| Nome | Valor |
|---|---|
| `EDGE_CONFIG` | `https://edge-config.vercel.com/ecfg_SEU_ID?token=SEU_TOKEN_LEITURA` |
| `EDGE_CONFIG_ID` | `ecfg_SEU_ID` (o ID do passo 3) |
| `EDGE_CONFIG_TOKEN` | O token de leitura do passo 3 |
| `VERCEL_TOKEN` | O token da API do passo 4 |
| `SENHA_PAINEL` | A senha que quiser para acessar o admin |
| `APPS_SCRIPT_MASTER_URL` | A URL do Apps Script master (passo 7) |

3. Após adicionar todas as variáveis, vai em **Deployments** e faz **Redeploy** do último deploy

---

### 6. Vercel — Configurar Domínio Personalizado (opcional)

Se quiser manter a URL `admin-fiec.vercel.app`:
1. Vai em **Settings → Domains**
2. Clica em **Add Domain**
3. Digite `admin-fiec.vercel.app`
4. O Vercel vai configurar automaticamente

Se a URL mudar e os HTMLs dos polos no Google Sites estiverem com a URL antiga:
1. Baixa os arquivos `polo.html` e `inicio.html` do repositório
2. Substitui todas as ocorrências da URL antiga pela nova
3. Faz upload dos arquivos atualizados no GitHub

---

### 7. Google Apps Script — Configurar a Planilha Master

1. Abre a planilha master no Google Sheets
2. Vai em **Extensões → Apps Script**
3. Cola o conteúdo do arquivo `apps-script-master.js`
4. Salva (Ctrl+S) — **não precisa reimplantar**
5. Vai em **Implantar → Nova implantação**
6. Tipo: **App da Web**
7. Acesso: **Qualquer pessoa**
8. Clica em **Implantar** e copia a URL gerada
9. Adiciona essa URL na variável `APPS_SCRIPT_MASTER_URL` no Vercel (passo 5)

---

### 8. Verificar se está funcionando

1. Acessa `https://SEU-DOMINIO.vercel.app/index.html`
2. Faz login com a senha configurada
3. Deve aparecer o painel com os polos
4. Se aparecer vazio, clica em **↓ Restaurar emergência** para carregar os dados da planilha
5. Clica em **↑ Fazer backup agora** para confirmar

---

### 9. Atualizar o Google Sites

Para cada polo no Google Sites:
1. Edita a página do polo
2. Clica no bloco de incorporação (iframe)
3. Substitui a URL pela nova:
   ```
   https://SEU-DOMINIO.vercel.app/polo.html?id=polo-fiec
   ```
4. Para a página inicial:
   ```
   https://SEU-DOMINIO.vercel.app/inicio.html
   ```

---

### Se a URL do Vercel mudar

Todos os arquivos que precisam ser atualizados com a nova URL:

**No repositório GitHub:**
- `public/polo.html` — linha com `const VERCEL_URL = '...'`
- `public/inicio.html` — linha com `const VERCEL_URL = '...'`
- `public/admin.html` — linha com `const API = '...'` e na função `copiarUrl`

**No Google Sites:**
- URL de cada polo incorporado
- URL da página inicial incorporada

