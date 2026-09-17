CONTROLE DE TOALHAS - ESCOLA DE NATACAO
=======================================

Status: entrega completa (API + frontend caps. 1-3 + PDF com diagramas e prototipo)


Onde cada parte da atividade foi aplicada
-----------------------------------------

1) Atividade 1 - Documentacao PDF
   - Arquivo final: lia\docs\documentacao.pdf
   - Inclui: equipe, cenario, requisitos, casos de uso (imagem),
     prototipo das 6 telas (imagens), DER (imagem), link do repositorio
   - Para regenerar o PDF: py lia\docs\gerar_documentacao.py

2) Atividade 1 - API
   - Pasta: lia\api
   - Entidades: Funcionario, Nadador, Toalha, Movimentacao
   - CRUD + retirada/devolucao + consultas + historico
   - Data/hora automatica e bloqueio de toalha em uso

3) Atividade 2 / Capitulo 1 - Lista dinamica
   - lia\frontend\app.js
   - Lista de objetos gerando HTML dinamicamente

4) Atividade 2 / Capitulo 2 - Classes e POO
   - lia\frontend\app.js
   - Classes Toalha e ToalhaManutencao, render(), encapsulamento, heranca

5) Atividade 2 / Capitulo 3 - Eventos e CRUD
   - lia\frontend\index.html + app.js + styles.css
   - Criar / Alterar / Excluir com dialog e data-id
   - Recurso do projeto: Toalha

6) Prototipo navegavel das demais telas
   - lia\docs\prototipo\index.html


Como rodar no Windows
---------------------

A) Se o PowerShell bloquear scripts (ExecutionPolicy)
-----------------------------------------------------
Erro tipico:
  "a execucao de scripts foi desabilitada neste sistema"

No PowerShell (pode ser como usuario atual):

  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

Ou so nesta janela:

  Set-ExecutionPolicy -Scope Process Bypass

Alternativa sem mudar politica:

  .\.venv\Scripts\activate.bat


B) Rodar a API
--------------
  cd C:\Users\rtond\Desktop\lia\lia\api
  py -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  py run.py

Abrir: http://127.0.0.1:5000/


C) Rodar o frontend (caps. 1-3)
-------------------------------
Abrir no navegador:
  C:\Users\rtond\Desktop\lia\lia\frontend\index.html


D) Abrir prototipo das telas / PDF
----------------------------------
  C:\Users\rtond\Desktop\lia\lia\docs\prototipo\index.html
  C:\Users\rtond\Desktop\lia\lia\docs\documentacao.pdf


Estrutura
---------
lia\
  README.txt
  api\
  frontend\
  docs\
    documentacao.pdf
    documentacao.md
    gerar_documentacao.py
    imagens\
    prototipo\


Repositorio
-----------
https://github.com/Marilia-Gomes11022/emprestimo-de-toalhas-POS.git


Obs. equipe no PDF
------------------
O PDF ja cita Marilia Gomes (dona do repositorio GitHub).
Se o grupo tiver mais integrantes, edite gerar_documentacao.py
(secao equipe) e rode de novo: py gerar_documentacao.py
