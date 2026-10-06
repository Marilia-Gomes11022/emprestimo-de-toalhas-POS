
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

## Frontend com persistência local

Abra `index.html` no navegador para acessar o painel e as páginas de toalhas,
funcionários, nadadores e movimentações. O código desta versão está organizado
em `js/classes/`, `js/dados/` e `js/interface/`.

Os registros são armazenados no `localStorage` deste navegador. Uma
movimentação mantém referências aos objetos funcionário, nadador e toalha
durante o uso; no carregamento, os objetos são reconstruídos pelas classes e
as referências são restabelecidas usando os IDs persistidos. A exclusão de
funcionários, nadadores ou toalhas usados por movimentações é bloqueada.

Os dados são locais ao navegador e à origem utilizada para abrir os arquivos.
Limpar os dados do site remove os registros armazenados.
