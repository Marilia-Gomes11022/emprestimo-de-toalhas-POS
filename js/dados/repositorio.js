(function () {
  const CHAVE = "nadoLivre.dados.v1";
  const { Funcionario, Nadador, Toalha, Movimentacao } = window.Modelos;

  function ler() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === null) {
      return { funcionarios: [], nadadores: [], toalhas: [], movimentacoes: [] };
    }

    const dados = JSON.parse(salvo);
    if (!dados || !Array.isArray(dados.funcionarios) || !Array.isArray(dados.nadadores) ||
        !Array.isArray(dados.toalhas) || !Array.isArray(dados.movimentacoes)) {
      throw new Error("Os dados salvos estão inválidos. Limpe os dados locais ou restaure um backup válido.");
    }

    const funcionarios = dados.funcionarios.map((item) =>
      new Funcionario(item.nome, item.matricula, item.cargo, item.id));
    const nadadores = dados.nadadores.map((item) =>
      new Nadador(item.nome, item.documento, item.turma, item.id));
    const toalhas = dados.toalhas.map((item) =>
      new Toalha(item.codigo, item.tamanho, item.status, item.id));
    const porId = (itens, id, tipo) => {
      const entidade = itens.find((item) => item.id === Number(id));
      if (!entidade) {
        throw new Error(`Movimentação contém referência inválida de ${tipo} (ID ${id}).`);
      }
      return entidade;
    };
    const movimentacoes = dados.movimentacoes.map((item) =>
      new Movimentacao(
        porId(funcionarios, item.funcionarioId, "funcionário"),
        porId(nadadores, item.nadadorId, "nadador"),
        porId(toalhas, item.toalhaId, "toalha"),
        item.retirada,
        item.devolucao,
        item.id
      ));

    return { funcionarios, nadadores, toalhas, movimentacoes };
  }

  function salvar(dados) {
    const serializado = {
      funcionarios: dados.funcionarios.map(({ id, nome, matricula, cargo }) => ({ id, nome, matricula, cargo })),
      nadadores: dados.nadadores.map(({ id, nome, documento, turma }) => ({ id, nome, documento, turma })),
      toalhas: dados.toalhas.map(({ id, codigo, tamanho, status }) => ({ id, codigo, tamanho, status })),
      movimentacoes: dados.movimentacoes.map(({ id, funcionario, nadador, toalha, retirada, devolucao }) => ({
        id,
        funcionarioId: funcionario.id,
        nadadorId: nadador.id,
        toalhaId: toalha.id,
        retirada,
        devolucao,
      })),
    };
    localStorage.setItem(CHAVE, JSON.stringify(serializado));
  }

  window.Repositorio = { ler, salvar };
})();
