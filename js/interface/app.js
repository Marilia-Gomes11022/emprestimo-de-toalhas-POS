(function () {
  const { Funcionario, Nadador, Toalha, Movimentacao } = window.Modelos;
  const formulario = document.querySelector("#form-recurso");
  const cabecalho = document.querySelector("#cabecalho-tabela");
  const corpo = document.querySelector("#corpo-tabela");
  const mensagem = document.querySelector("#mensagem");
  const recurso = document.body.dataset.recurso;
  let dados;
  let editandoId = null;

  const definicoes = {
    funcionarios: {
      campos: [["nome", "Nome"], ["matricula", "Matrícula"], ["cargo", "Cargo"]],
      colunas: [["Nome", (item) => item.nome], ["Matrícula", (item) => item.matricula], ["Cargo", (item) => item.cargo]],
      criar: (valores) => new Funcionario(valores.nome, valores.matricula, valores.cargo),
      atualizar: (item, valores) => Object.assign(item, valores),
    },
    nadadores: {
      campos: [["nome", "Nome"], ["documento", "Documento"], ["turma", "Turma"]],
      colunas: [["Nome", (item) => item.nome], ["Documento", (item) => item.documento], ["Turma", (item) => item.turma]],
      criar: (valores) => new Nadador(valores.nome, valores.documento, valores.turma),
      atualizar: (item, valores) => Object.assign(item, valores),
    },
    toalhas: {
      campos: [["codigo", "Código"], ["tamanho", "Tamanho"], ["status", "Status"]],
      colunas: [["Código", (item) => item.codigo], ["Tamanho", (item) => item.tamanho], ["Status", (item) => item.status]],
      criar: (valores) => new Toalha(valores.codigo, valores.tamanho, valores.status),
      atualizar: (item, valores) => Object.assign(item, valores),
    },
    movimentacoes: {
      campos: [],
      colunas: [
        ["Funcionário", (item) => item.funcionario.nome],
        ["Nadador", (item) => item.nadador.nome],
        ["Toalha", (item) => item.toalha.codigo],
        ["Retirada", (item) => new Date(item.retirada).toLocaleString("pt-BR")],
        ["Devolução", (item) => item.devolucao ? new Date(item.devolucao).toLocaleString("pt-BR") : "Em aberto"],
      ],
      criar: (valores) => new Movimentacao(valores.funcionario, valores.nadador, valores.toalha),
    },
  };

  function notificar(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.classList.toggle("mensagem-erro", erro);
    mensagem.classList.toggle("mensagem-sucesso", !erro);
  }

  function selecao(nome, rotulo, itens, texto) {
    const label = document.createElement("label");
    label.textContent = rotulo;
    const select = document.createElement("select");
    select.name = nome;
    select.required = true;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = `Selecione ${rotulo.toLocaleLowerCase("pt-BR")}`;
    select.append(placeholder);
    for (const item of itens) {
      const opcao = document.createElement("option");
      opcao.value = String(item.id);
      opcao.textContent = texto(item);
      select.append(opcao);
    }
    label.append(select);
    return label;
  }

  function montarFormulario() {
    formulario.replaceChildren();
    if (recurso === "movimentacoes") {
      formulario.append(
        selecao("funcionario", "Funcionário", dados.funcionarios, (item) => item.nome),
        selecao("nadador", "Nadador", dados.nadadores, (item) => item.nome),
        selecao("toalha", "Toalha disponível", dados.toalhas.filter((item) => item.status === "disponivel"), (item) => `${item.codigo} (${item.tamanho})`)
      );
    } else {
      for (const [nome, rotulo] of definicoes[recurso].campos) {
        const label = document.createElement("label");
        label.textContent = rotulo;
        let campo;
        if (nome === "tamanho" || nome === "status") {
          campo = document.createElement("select");
          const opcoes = nome === "tamanho"
            ? [["P", "P"], ["M", "M"], ["G", "G"]]
            : [["disponivel", "Disponível"], ["em_uso", "Em uso"], ["manutencao", "Manutenção"]];
          for (const [valor, texto] of opcoes) {
            const opcao = document.createElement("option");
            opcao.value = valor;
            opcao.textContent = texto;
            campo.append(opcao);
          }
        } else {
          campo = document.createElement("input");
          campo.type = "text";
          campo.maxLength = 120;
        }
        campo.name = nome;
        campo.required = true;
        label.append(campo);
        formulario.append(label);
      }
    }

    const salvar = document.createElement("button");
    salvar.className = "btn success";
    salvar.type = "submit";
    salvar.textContent = "Cadastrar";
    salvar.id = "botao-salvar";
    formulario.append(salvar);
    if (recurso === "movimentacoes") {
      formulario.hidden = !dados.funcionarios.length || !dados.nadadores.length || !dados.toalhas.some((item) => item.status === "disponivel");
      if (formulario.hidden) {
        notificar("Cadastre um funcionário, um nadador e uma toalha disponível antes de registrar uma retirada.", true);
      }
    }
  }

  function renderizar() {
    montarFormulario();
    cabecalho.replaceChildren();
    corpo.replaceChildren();
    const linhaCabecalho = document.createElement("tr");
    for (const [titulo] of definicoes[recurso].colunas) {
      const th = document.createElement("th");
      th.textContent = titulo;
      linhaCabecalho.append(th);
    }
    const thAcoes = document.createElement("th");
    thAcoes.textContent = "Ações";
    linhaCabecalho.append(thAcoes);
    cabecalho.append(linhaCabecalho);

    for (const item of dados[recurso]) {
      const tr = document.createElement("tr");
      tr.dataset.id = String(item.id);
      for (const [, obter] of definicoes[recurso].colunas) {
        const td = document.createElement("td");
        td.textContent = String(obter(item));
        tr.append(td);
      }
      const tdAcoes = document.createElement("td");
      const botoes = document.createElement("div");
      botoes.className = "acoes";
      if (recurso !== "movimentacoes") {
        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn primary";
        editar.dataset.acao = "editar";
        editar.textContent = "Editar";
        botoes.append(editar);
      } else if (!item.devolucao) {
        const devolver = document.createElement("button");
        devolver.type = "button";
        devolver.className = "btn primary";
        devolver.dataset.acao = "devolver";
        devolver.textContent = "Registrar devolução";
        botoes.append(devolver);
      }
      const excluir = document.createElement("button");
      excluir.type = "button";
      excluir.className = "btn danger";
      excluir.dataset.acao = "excluir";
      excluir.textContent = "Excluir";
      botoes.append(excluir);
      tdAcoes.append(botoes);
      tr.append(tdAcoes);
      corpo.append(tr);
    }
  }

  function editar(item) {
    editandoId = item.id;
    for (const [nome] of definicoes[recurso].campos) {
      formulario.elements.namedItem(nome).value = item[nome];
    }
    formulario.querySelector("#botao-salvar").textContent = "Salvar alterações";
    notificar(`Editando registro ${item.id}.`);
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const valoresForm = new FormData(formulario);
    try {
      if (recurso === "movimentacoes") {
        const funcionario = dados.funcionarios.find((item) => item.id === Number(valoresForm.get("funcionario")));
        const nadador = dados.nadadores.find((item) => item.id === Number(valoresForm.get("nadador")));
        const toalha = dados.toalhas.find((item) => item.id === Number(valoresForm.get("toalha")));
        if (!funcionario || !nadador || !toalha || toalha.status !== "disponivel") {
          throw new Error("Selecione recursos válidos e uma toalha disponível.");
        }
        dados.movimentacoes.push(definicoes[recurso].criar({ funcionario, nadador, toalha }));
        toalha.status = "em_uso";
      } else {
        const valores = Object.fromEntries(valoresForm.entries());
        if (recurso === "toalhas" && !["disponivel", "em_uso", "manutencao"].includes(valores.status)) {
          throw new Error("Selecione um status válido.");
        }
        if (editandoId === null) {
          dados[recurso].push(definicoes[recurso].criar(valores));
        } else {
          const item = dados[recurso].find((registro) => registro.id === editandoId);
          definicoes[recurso].atualizar(item, valores);
          editandoId = null;
        }
      }
      window.Repositorio.salvar(dados);
      formulario.reset();
      renderizar();
      notificar("Alterações salvas com sucesso.");
    } catch (erro) {
      notificar(`Não foi possível salvar: ${erro.message}`, true);
    }
  });

  formulario.addEventListener("input", (evento) => {
    if (editandoId !== null && evento.target.matches("input, select")) {
      formulario.querySelector("#botao-salvar").textContent = "Salvar alterações";
    }
  });

  corpo.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;
    const linha = botao.closest("tr");
    const id = Number(linha.dataset.id);
    const item = dados[recurso].find((registro) => registro.id === id);
    if (!item) return;

    if (botao.dataset.acao === "editar") {
      editar(item);
      return;
    }
    if (botao.dataset.acao === "devolver") {
      item.devolucao = new Date().toISOString();
      item.toalha.status = "disponivel";
      try {
        window.Repositorio.salvar(dados);
        renderizar();
        notificar("Devolução registrada.");
      } catch (erro) {
        notificar(`Não foi possível salvar a devolução: ${erro.message}`, true);
      }
      return;
    }

    const dependencias = recurso === "toalhas"
      ? dados.movimentacoes.some((movimentacao) => movimentacao.toalha === item)
      : recurso === "funcionarios"
        ? dados.movimentacoes.some((movimentacao) => movimentacao.funcionario === item)
        : recurso === "nadadores"
          ? dados.movimentacoes.some((movimentacao) => movimentacao.nadador === item)
          : false;
    if (dependencias) {
      notificar("Exclusão bloqueada: este registro está relacionado a uma ou mais movimentações.", true);
      return;
    }
    if (!window.confirm("Deseja excluir este registro?")) return;

    if (recurso === "movimentacoes" && !item.devolucao) {
      item.toalha.status = "disponivel";
    }
    dados[recurso] = dados[recurso].filter((registro) => registro.id !== id);
    try {
      window.Repositorio.salvar(dados);
      renderizar();
      notificar("Registro excluído.");
    } catch (erro) {
      notificar(`Não foi possível salvar a exclusão: ${erro.message}`, true);
    }
  });

  try {
    if (!Object.prototype.hasOwnProperty.call(definicoes, recurso)) {
      throw new Error("Recurso desconhecido.");
    }
    dados = window.Repositorio.ler();
    renderizar();
  } catch (erro) {
    notificar(`Não foi possível carregar os dados: ${erro.message}`, true);
    formulario.hidden = true;
  }
})();
