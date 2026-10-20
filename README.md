
Repositório criado para a realização do estudo de caso "Sistema de empréstimo de tolhas" da matéria de POS

# NOME: Controle de toalhas - Nado Livre

## Identificação

**Estudo de Caso:** Sistema de controle de toalhas em uma escola de natação

**Equipe:** 

### Integrantes

- Diana Chrisley Silva do Nascimento
- Ingrid Paula Tavares da Silva
- Maria Clara da Silva Santos
- Marília Gomes de Araújo
- Sarah Elouise Guimarães de Azevedo
# Nado Livre — Controle de Toalhas

Projeto do estudo de caso de empréstimo de toalhas para escola de natação.

## Funcionalidades

- Cadastro e listagem de toalhas, nadadores e funcionários.
- Permissão individual para o nadador retirar toalhas, com indicação visual e botão para conceder/retirar.
- Registro de empréstimo somente para nadadores autorizados e toalhas disponíveis.
- Registro de devolução e histórico de empréstimos.
- Interface salva os dados no `localStorage` do navegador. A API Flask persiste os dados em SQLite e aplica a mesma regra de permissão no servidor.
- Retirar a permissão não exclui o cadastro nem altera empréstimos já registrados.

## Como abrir a interface

Abra `frontend/index.html` no navegador. Os dados da interface ficam salvos nesse navegador. Para recomeçar os dados de demonstração, limpe o armazenamento local do site no navegador (chave `nadoLivre.controleToalhas.v1`).

## Como executar a API (Windows)

No terminal, entre na pasta `api` e execute:

```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
py run.py
```

A API ficará disponível em `http://127.0.0.1:5000/`. O banco SQLite `api/toalhas.db` é criado automaticamente; a inicialização também adiciona a coluna de permissão a bancos existentes.

## Endpoints principais

- `GET/POST /nadadores`
- `PUT /nadadores/<id>`
- `PATCH /nadadores/<id>/permissao` com JSON `{"pode_retirar_toalhas": true}` ou `false`
- `POST /movimentacoes/retirada` — retorna HTTP `403` quando o nadador não tem permissão
- `POST /movimentacoes/devolucao`

A permissão é `true` por padrão para cadastros novos e para cadastros antigos sem o campo.
