(function () {
  const resumo = document.querySelector("#resumo");
  try {
    const dados = window.Repositorio.ler();
    const totais = [
      ["Toalhas", dados.toalhas.length],
      ["Funcionários", dados.funcionarios.length],
      ["Nadadores", dados.nadadores.length],
      ["Movimentações", dados.movimentacoes.length],
    ];
    for (const [nome, total] of totais) {
      const item = document.createElement("article");
      item.className = "resumo-item";
      const quantidade = document.createElement("strong");
      quantidade.textContent = String(total);
      const rotulo = document.createElement("span");
      rotulo.textContent = nome;
      item.append(quantidade, rotulo);
      resumo.append(item);
    }
  } catch (erro) {
    resumo.textContent = `Não foi possível carregar os dados salvos: ${erro.message}`;
    resumo.classList.add("mensagem-erro");
  }
})();
