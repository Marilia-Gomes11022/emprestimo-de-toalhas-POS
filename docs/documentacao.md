# Controle de Toalhas em Escola de Natacao

Documento completo gerado em: `documentacao.pdf`

Inclui diagramas de casos de uso, DER, prototipos das telas, requisitos, analise e link do repositorio.

Para regenerar:

```text
py gerar_documentacao.py
```

## Controle de permissão para empréstimos

Cada nadador possui o campo `pode_retirar_toalhas`, inicialmente verdadeiro. A interface permite conceder ou retirar a permissão, apresenta o estado na listagem e persiste os dados no `localStorage`. A função que registra empréstimos verifica a permissão antes de gravar a movimentação; a API Flask realiza a mesma validação no endpoint `/movimentacoes/retirada` e rejeita tentativas não autorizadas com HTTP 403. Alterar a permissão não exclui cadastro nem movimentações anteriores.
