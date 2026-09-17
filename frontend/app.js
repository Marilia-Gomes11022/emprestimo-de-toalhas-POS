class Toalha {
  static #proximoId = 1;

  #id;
  #codigo;
  #tamanho;
  #status;

  constructor(codigo, tamanho, status = "disponivel", id = null) {
    this.#id = id ?? Toalha.#proximoId++;
    this.#codigo = codigo;
    this.#tamanho = tamanho;
    this.#status = status;
    if (id !== null && id >= Toalha.#proximoId) {
      Toalha.#proximoId = id + 1;
    }
  }

  get id() {
    return this.#id;
  }

  get codigo() {
    return this.#codigo;
  }

  set codigo(valor) {
    this.#codigo = valor;
  }

  get tamanho() {
    return this.#tamanho;
  }

  set tamanho(valor) {
    this.#tamanho = valor;
  }

  get status() {
    return this.#status;
  }

  set status(valor) {
    this.#status = valor;
  }

  get rotuloStatus() {
    const mapa = {
      disponivel: "Disponivel",
      em_uso: "Em uso",
      manutencao: "Manutencao",
    };
    return mapa[this.#status] ?? this.#status;
  }

  atualizar(codigo, tamanho, status) {
    this.#codigo = codigo;
    this.#tamanho = tamanho;
    this.#status = status;
  }

  render() {
    const item = document.createElement("article");
    item.className = "card-toalha";
    item.dataset.id = String(this.#id);

    const titulo = document.createElement("h3");
    titulo.textContent = this.#codigo;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `Tamanho ${this.#tamanho}`;

    const status = document.createElement("span");
    status.className = `status ${this.#status}`;
    status.textContent = this.rotuloStatus;

    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn primary";
    btnEditar.dataset.acao = "editar";
    btnEditar.textContent = "Editar";

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "btn danger";
    btnRemover.dataset.acao = "remover";
    btnRemover.textContent = "Remover";

    acoes.append(btnEditar, btnRemover);
    item.append(titulo, meta, status, acoes);
    return item;
  }
}

class ToalhaManutencao extends Toalha {
  #observacao;

  constructor(codigo, tamanho, observacao = "Aguardando lavanderia", id = null) {
    super(codigo, tamanho, "manutencao", id);
    this.#observacao = observacao;
  }

  get observacao() {
    return this.#observacao;
  }

  set observacao(valor) {
    this.#observacao = valor;
  }

  atualizar(codigo, tamanho, status, observacao) {
    super.atualizar(codigo, tamanho, status);
    if (observacao !== undefined) {
      this.#observacao = observacao;
    }
  }

  render() {
    const item = super.render();
    item.classList.add("manutencao");

    const obs = document.createElement("p");
    obs.className = "meta";
    obs.textContent = `Obs.: ${this.#observacao}`;
    item.insertBefore(obs, item.querySelector(".acoes"));
    return item;
  }
}

const listaEl = document.querySelector("#lista-toalhas");
const dialogo = document.querySelector("#dialogo-toalha");
const form = document.querySelector("#form-toalha");
const tituloDialogo = document.querySelector("#titulo-dialogo");
const campoId = document.querySelector("#campo-id");
const campoCodigo = document.querySelector("#campo-codigo");
const campoTamanho = document.querySelector("#campo-tamanho");
const campoStatus = document.querySelector("#campo-status");
const campoTipo = document.querySelector("#campo-tipo");
const campoObservacao = document.querySelector("#campo-observacao");
const rotuloObservacao = document.querySelector("#rotulo-observacao");
const btnNova = document.querySelector("#btn-nova");
const btnCancelar = document.querySelector("#btn-cancelar");

const toalhas = [
  new Toalha("TL-001", "M", "disponivel"),
  new Toalha("TL-002", "G", "em_uso"),
  new ToalhaManutencao("TL-003", "P", "Costura do acabamento"),
];

function localizarToalha(id) {
  return toalhas.find((item) => item.id === id);
}

function criarRegistros() {
  listaEl.innerHTML = "";
  for (const toalha of toalhas) {
    listaEl.append(toalha.render());
  }
}

function abrirDialogoCriacao() {
  form.reset();
  campoId.value = "";
  tituloDialogo.textContent = "Adicionar toalha";
  document.querySelector("#btn-salvar").textContent = "Adicionar";
  campoTipo.value = "comum";
  campoStatus.value = "disponivel";
  atualizarCamposTipo();
  dialogo.showModal();
}

function abrirDialogoEdicao(id) {
  const toalha = localizarToalha(id);
  if (!toalha) {
    return;
  }

  tituloDialogo.textContent = "Editar toalha";
  document.querySelector("#btn-salvar").textContent = "Salvar";
  campoId.value = String(toalha.id);
  campoCodigo.value = toalha.codigo;
  campoTamanho.value = toalha.tamanho;
  campoStatus.value = toalha.status;

  if (toalha instanceof ToalhaManutencao) {
    campoTipo.value = "manutencao";
    campoObservacao.value = toalha.observacao;
  } else {
    campoTipo.value = "comum";
    campoObservacao.value = "";
  }

  atualizarCamposTipo();
  dialogo.showModal();
}

function atualizarCamposTipo() {
  const manutencao = campoTipo.value === "manutencao";
  rotuloObservacao.hidden = !manutencao;
  if (manutencao) {
    campoStatus.value = "manutencao";
  }
}

function criarRegistro(codigo, tamanho, status, tipo, observacao) {
  let registro;
  if (tipo === "manutencao") {
    registro = new ToalhaManutencao(codigo, tamanho, observacao || "Aguardando lavanderia");
  } else {
    registro = new Toalha(codigo, tamanho, status);
  }
  toalhas.push(registro);
  criarRegistros();
}

function alterarRegistro(id, codigo, tamanho, status, tipo, observacao) {
  const indice = toalhas.findIndex((item) => item.id === id);
  if (indice < 0) {
    return;
  }

  const atual = toalhas[indice];

  if (tipo === "manutencao") {
    if (atual instanceof ToalhaManutencao) {
      atual.atualizar(codigo, tamanho, "manutencao", observacao || atual.observacao);
    } else {
      toalhas[indice] = new ToalhaManutencao(
        codigo,
        tamanho,
        observacao || "Aguardando lavanderia",
        id
      );
    }
  } else if (atual instanceof ToalhaManutencao) {
    toalhas[indice] = new Toalha(codigo, tamanho, status, id);
  } else {
    atual.atualizar(codigo, tamanho, status);
  }

  criarRegistros();
}

function excluirRegistro(id) {
  const indice = toalhas.findIndex((item) => item.id === id);
  if (indice >= 0) {
    toalhas.splice(indice, 1);
    criarRegistros();
  }
}

btnNova.addEventListener("click", () => {
  abrirDialogoCriacao();
});

btnCancelar.addEventListener("click", () => {
  dialogo.close();
});

campoTipo.addEventListener("change", () => {
  atualizarCamposTipo();
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const id = campoId.value ? Number(campoId.value) : null;
  const codigo = campoCodigo.value.trim();
  const tamanho = campoTamanho.value;
  const status = campoStatus.value;
  const tipo = campoTipo.value;
  const observacao = campoObservacao.value.trim();

  if (!codigo) {
    return;
  }

  if (id === null) {
    criarRegistro(codigo, tamanho, status, tipo, observacao);
  } else {
    alterarRegistro(id, codigo, tamanho, status, tipo, observacao);
  }

  dialogo.close();
});

listaEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) {
    return;
  }

  const card = botao.closest("[data-id]");
  if (!card) {
    return;
  }

  const id = Number(card.dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "editar") {
    abrirDialogoEdicao(id);
  }

  if (acao === "remover") {
    const ok = window.confirm("Deseja remover este registro?");
    if (ok) {
      excluirRegistro(id);
    }
  }
});

criarRegistros();
