export function elemento(tag, texto, classe) {
  const el = document.createElement(tag);
  if (texto !== undefined && texto !== null) el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

export function criarItemToalha(toalha) {
  const item = elemento("article", null, `card-toalha ${toalha.tipo === "manutencao" ? "manutencao" : ""}`);
  item.dataset.id = String(toalha.id);
  item.append(elemento("h3", toalha.codigo));
  item.append(elemento("p", `Tamanho ${toalha.tamanho}`, "meta"));
  const statusTexto = ({ disponivel: "Disponível", em_uso: "Em uso", manutencao: "Manutenção" })[toalha.status] || toalha.status;
  item.append(elemento("span", statusTexto, `status ${toalha.status}`));
  if (toalha.tipo === "manutencao" && toalha.observacao) item.append(elemento("p", `Obs.: ${toalha.observacao}`, "meta"));
  const acoes = elemento("div", null, "acoes");
  const editar = elemento("button", "Editar", "btn primary"); editar.type = "button"; editar.dataset.acao = "editar";
  const remover = elemento("button", "Remover", "btn danger"); remover.type = "button"; remover.dataset.acao = "remover";
  acoes.append(editar, remover); item.append(acoes);
  return item;
}

export function criarCelula(texto) {
  const td = document.createElement("td"); td.textContent = texto ?? "—"; return td;
}
