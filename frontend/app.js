import { Toalha } from "./classes/Toalha.js";
import { ToalhaManutencao } from "./classes/ToalhaManutencao.js";
import { renderizarToalhas } from "./interface/toalhas.js";

const STORAGE_KEY = "nadoLivre.controleToalhas.v1";
function dadosIniciais() {
  return {
    nadadores: [
      { id: 1, nome: "João Silva", documento: "123.456.789-00", turma: "Infantil A", podeRetirarToalhas: true },
      { id: 2, nome: "Marina Costa", documento: "987.654.321-00", turma: "Adulto", podeRetirarToalhas: false }
    ],
    funcionarios: [{ id: 1, nome: "Ana Costa", matricula: "F-001", cargo: "Atendente" }],
    toalhas: [
      { id: 1, codigo: "TL-001", tamanho: "M", status: "disponivel", tipo: "comum", observacao: "" },
      { id: 2, codigo: "TL-002", tamanho: "G", status: "disponivel", tipo: "comum", observacao: "" },
      { id: 3, codigo: "TL-003", tamanho: "P", status: "manutencao", tipo: "manutencao", observacao: "Costura do acabamento" }
    ],
    emprestimos: []
  };
}
function carregarDados() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) return dadosIniciais();
    const dados = JSON.parse(salvo);
    const inicial = dadosIniciais();
    const resultado = { ...inicial, ...dados };
    for (const chave of ["nadadores", "funcionarios", "toalhas", "emprestimos"]) {
      if (!Array.isArray(resultado[chave])) resultado[chave] = inicial[chave];
    }
    resultado.nadadores = resultado.nadadores.map((n) => ({
      ...n,
      // Cadastros antigos, sem o campo, continuam autorizados por padrão.
      podeRetirarToalhas: n.podeRetirarToalhas !== false
    }));
    return resultado;
  } catch (erro) {
    console.warn("Não foi possível ler os dados salvos; usando dados iniciais.", erro);
    return dadosIniciais();
  }
}

const dadosSalvos = carregarDados();
let nadadores = dadosSalvos.nadadores;
let funcionarios = dadosSalvos.funcionarios;
let toalhas = dadosSalvos.toalhas.map((t) => t.tipo === "manutencao"
  ? new ToalhaManutencao(t.codigo, t.tamanho, t.observacao || "Aguardando lavanderia", t.id)
  : new Toalha(t.codigo, t.tamanho, t.status, t.id));
let emprestimos = dadosSalvos.emprestimos;

const listaToalhas = document.querySelector("#lista-toalhas");
const dialogo = document.querySelector("#dialogo-toalha");
const formToalha = document.querySelector("#form-toalha");
const tituloDialogo = document.querySelector("#titulo-dialogo");
const campoId = document.querySelector("#campo-id");
const campoCodigo = document.querySelector("#campo-codigo");
const campoTamanho = document.querySelector("#campo-tamanho");
const campoStatus = document.querySelector("#campo-status");
const campoTipo = document.querySelector("#campo-tipo");
const campoObservacao = document.querySelector("#campo-observacao");
const rotuloObservacao = document.querySelector("#rotulo-observacao");
const mensagemEmprestimo = document.querySelector("#mensagem-emprestimo");

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, Number(item.id) || 0), 0) + 1;
}
function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function salvarDados() {
  const toalhasSerializadas = toalhas.map((t) => ({
    id: t.id, codigo: t.codigo, tamanho: t.tamanho, status: t.status,
    tipo: t instanceof ToalhaManutencao ? "manutencao" : "comum",
    observacao: t instanceof ToalhaManutencao ? t.observacao : ""
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nadadores, funcionarios, toalhas: toalhasSerializadas, emprestimos }));
  } catch (erro) {
    console.error("Falha ao salvar no localStorage", erro);
    mostrarMensagem("Não foi possível salvar os dados neste navegador.", "erro");
  }
}
function localizarToalha(id) { return toalhas.find((item) => item.id === id); }
function localizarNadador(id) { return nadadores.find((item) => Number(item.id) === Number(id)); }
function localizarFuncionario(id) { return funcionarios.find((item) => Number(item.id) === Number(id)); }
function mostrarMensagem(texto, tipo = "sucesso") {
  mensagemEmprestimo.textContent = texto;
  mensagemEmprestimo.className = `mensagem ${tipo}`;
}
function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? valor : data.toLocaleString("pt-BR");
}

function criarRegistrosToalhas() {
  renderizarToalhas(toalhas, listaToalhas);
}
function renderNadadores() {
  const corpo = document.querySelector("#lista-nadadores");
  if (!nadadores.length) {
    corpo.innerHTML = '<tr><td colspan="5" class="vazio">Nenhum nadador cadastrado.</td></tr>';
    return;
  }
  corpo.innerHTML = nadadores.map((n) => `
    <tr>
      <td>${escapar(n.nome)}</td><td>${escapar(n.documento)}</td><td>${escapar(n.turma)}</td>
      <td><span class="permissao ${n.podeRetirarToalhas ? "permitido" : "bloqueado"}">${n.podeRetirarToalhas ? "Autorizado" : "Sem permissão"}</span></td>
      <td><button type="button" class="btn ${n.podeRetirarToalhas ? "danger" : "success"}" data-permissao="${Number(n.id)}">${n.podeRetirarToalhas ? "Retirar permissão" : "Conceder permissão"}</button></td>
    </tr>`).join("");
}
function renderFuncionarios() {
  const corpo = document.querySelector("#lista-funcionarios");
  corpo.innerHTML = funcionarios.length ? funcionarios.map((f) => `
    <tr><td>${escapar(f.nome)}</td><td>${escapar(f.matricula)}</td><td>${escapar(f.cargo)}</td></tr>`).join("")
    : '<tr><td colspan="3" class="vazio">Nenhum funcionário cadastrado.</td></tr>';
}
function renderSelectsEmprestimo() {
  const funcSelect = document.querySelector("#emprestimo-funcionario");
  const nadadorSelect = document.querySelector("#emprestimo-nadador");
  const toalhaSelect = document.querySelector("#emprestimo-toalha");
  const funcAnterior = funcSelect.value;
  const nadadorAnterior = nadadorSelect.value;
  const toalhaAnterior = toalhaSelect.value;
  funcSelect.innerHTML = funcionarios.map((f) => `<option value="${Number(f.id)}">${escapar(f.nome)} — ${escapar(f.matricula)}</option>`).join("");
  nadadorSelect.innerHTML = nadadores.map((n) => `<option value="${Number(n.id)}">${escapar(n.nome)}${n.podeRetirarToalhas ? " — autorizado" : " — sem permissão"}</option>`).join("");
  toalhaSelect.innerHTML = toalhas.filter((t) => t.status === "disponivel").map((t) => `<option value="${t.id}">${escapar(t.codigo)} (${escapar(t.tamanho)})</option>`).join("");
  if (!funcionarios.length) funcSelect.innerHTML = '<option value="">Cadastre um funcionário primeiro</option>';
  if (!nadadores.length) nadadorSelect.innerHTML = '<option value="">Cadastre um nadador primeiro</option>';
  if (!toalhaSelect.options.length) toalhaSelect.innerHTML = '<option value="">Nenhuma toalha disponível</option>';
  if ([...funcSelect.options].some((o) => o.value === funcAnterior)) funcSelect.value = funcAnterior;
  if ([...nadadorSelect.options].some((o) => o.value === nadadorAnterior)) nadadorSelect.value = nadadorAnterior;
  if ([...toalhaSelect.options].some((o) => o.value === toalhaAnterior)) toalhaSelect.value = toalhaAnterior;
}
function renderEmprestimos() {
  const corpo = document.querySelector("#lista-emprestimos");
  const ordenados = [...emprestimos].sort((a, b) => new Date(b.dataHoraRetirada) - new Date(a.dataHoraRetirada));
  if (!ordenados.length) {
    corpo.innerHTML = '<tr><td colspan="5" class="vazio">Nenhum empréstimo registrado.</td></tr>';
    return;
  }
  corpo.innerHTML = ordenados.map((m) => {
    const nadador = localizarNadador(m.idNadador);
    const toalha = localizarToalha(Number(m.idToalha));
    const aberto = !m.dataHoraDevolucao;
    return `<tr>
      <td>${escapar(nadador?.nome || "Nadador removido")}</td>
      <td>${escapar(toalha?.codigo || "Toalha removida")}</td>
      <td>${escapar(formatarData(m.dataHoraRetirada))}</td>
      <td>${escapar(formatarData(m.dataHoraDevolucao))}</td>
      <td>${aberto ? `<button type="button" class="btn primary" data-devolver="${Number(m.id)}">Registrar devolução</button>` : '<span class="permissao devolvido">Devolvido</span>'}</td>
    </tr>`;
  }).join("");
}
function renderTudo() {
  criarRegistrosToalhas();
  renderNadadores();
  renderFuncionarios();
  renderSelectsEmprestimo();
  renderEmprestimos();
}
function atualizarCamposTipo() {
  const manutencao = campoTipo.value === "manutencao";
  rotuloObservacao.hidden = !manutencao;
  if (manutencao) campoStatus.value = "manutencao";
}
function abrirDialogoCriacao() {
  formToalha.reset(); campoId.value = "";
  tituloDialogo.textContent = "Adicionar toalha";
  document.querySelector("#btn-salvar").textContent = "Adicionar";
  campoTipo.value = "comum"; campoStatus.value = "disponivel";
  atualizarCamposTipo(); dialogo.showModal();
}
function abrirDialogoEdicao(id) {
  const toalha = localizarToalha(id);
  if (!toalha) return;
  tituloDialogo.textContent = "Editar toalha";
  document.querySelector("#btn-salvar").textContent = "Salvar";
  campoId.value = String(toalha.id); campoCodigo.value = toalha.codigo;
  campoTamanho.value = toalha.tamanho; campoStatus.value = toalha.status;
  if (toalha instanceof ToalhaManutencao) {
    campoTipo.value = "manutencao"; campoObservacao.value = toalha.observacao;
  } else {
    campoTipo.value = "comum"; campoObservacao.value = "";
  }
  atualizarCamposTipo(); dialogo.showModal();
}
function criarRegistroToalha(codigo, tamanho, status, tipo, observacao) {
  const registro = tipo === "manutencao"
    ? new ToalhaManutencao(codigo, tamanho, observacao || "Aguardando lavanderia", proximoId(toalhas))
    : new Toalha(codigo, tamanho, status, proximoId(toalhas));
  toalhas.push(registro); salvarDados(); renderTudo();
}
function alterarRegistroToalha(id, codigo, tamanho, status, tipo, observacao) {
  const indice = toalhas.findIndex((item) => item.id === id);
  if (indice < 0) return;
  const atual = toalhas[indice];
  if (tipo === "manutencao") {
    if (atual instanceof ToalhaManutencao) atual.atualizar(codigo, tamanho, "manutencao", observacao || atual.observacao);
    else toalhas[indice] = new ToalhaManutencao(codigo, tamanho, observacao || "Aguardando lavanderia", id);
  } else if (atual instanceof ToalhaManutencao) {
    toalhas[indice] = new Toalha(codigo, tamanho, status, id);
  } else atual.atualizar(codigo, tamanho, status);
  salvarDados(); renderTudo();
}
function excluirRegistroToalha(id) {
  const possuiEmprestimoAberto = emprestimos.some((m) => Number(m.idToalha) === Number(id) && !m.dataHoraDevolucao);
  if (possuiEmprestimoAberto) {
    mostrarMensagem("Não é possível remover uma toalha com empréstimo em aberto. Registre a devolução primeiro.", "erro");
    return;
  }
  toalhas = toalhas.filter((item) => item.id !== id);
  salvarDados(); renderTudo();
}

// Navegação simples entre os painéis.
document.querySelectorAll("[data-painel]").forEach((botao) => {
  botao.addEventListener("click", () => {
    document.querySelectorAll("[data-painel]").forEach((b) => {
      b.classList.toggle("success", b === botao);
      b.classList.toggle("default", b !== botao);
    });
    document.querySelectorAll(".painel").forEach((painel) => painel.classList.toggle("ativo", painel.id === botao.dataset.painel));
  });
});

document.querySelector("#btn-nova").addEventListener("click", abrirDialogoCriacao);
document.querySelector("#btn-cancelar").addEventListener("click", () => dialogo.close());
campoTipo.addEventListener("change", atualizarCamposTipo);
formToalha.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const id = campoId.value ? Number(campoId.value) : null;
  const codigo = campoCodigo.value.trim();
  const tamanho = campoTamanho.value;
  const status = campoStatus.value;
  const tipo = campoTipo.value;
  const observacao = campoObservacao.value.trim();
  if (!codigo) return;
  const duplicado = toalhas.some((t) => t.codigo.toLowerCase() === codigo.toLowerCase() && t.id !== id);
  if (duplicado) { alert("Já existe uma toalha com esse código."); return; }
  if (id === null) criarRegistroToalha(codigo, tamanho, status, tipo, observacao);
  else alterarRegistroToalha(id, codigo, tamanho, status, tipo, observacao);
  dialogo.close();
});
listaToalhas.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;
  const card = botao.closest("[data-id]");
  if (!card) return;
  const id = Number(card.dataset.id);
  if (botao.dataset.acao === "editar") abrirDialogoEdicao(id);
  if (botao.dataset.acao === "remover" && window.confirm("Deseja remover esta toalha?")) excluirRegistroToalha(id);
});

document.querySelector("#form-nadador").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = document.querySelector("#nadador-nome").value.trim();
  const documento = document.querySelector("#nadador-documento").value.trim();
  const turma = document.querySelector("#nadador-turma").value.trim();
  if (nadadores.some((n) => n.documento.toLowerCase() === documento.toLowerCase())) {
    alert("Já existe um nadador cadastrado com esse documento."); return;
  }
  nadadores.push({ id: proximoId(nadadores), nome, documento, turma, podeRetirarToalhas: document.querySelector("#nadador-permissao").checked });
  evento.target.reset(); document.querySelector("#nadador-permissao").checked = true;
  salvarDados(); renderTudo();
});
document.querySelector("#lista-nadadores").addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-permissao]");
  if (!botao) return;
  const nadador = localizarNadador(Number(botao.dataset.permissao));
  if (!nadador) return;
  // Alterar a permissão mantém o cadastro e todas as movimentações anteriores.
  nadador.podeRetirarToalhas = !nadador.podeRetirarToalhas;
  salvarDados(); renderTudo();
});

document.querySelector("#form-funcionario").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = document.querySelector("#funcionario-nome").value.trim();
  const matricula = document.querySelector("#funcionario-matricula").value.trim();
  const cargo = document.querySelector("#funcionario-cargo").value.trim();
  if (funcionarios.some((f) => f.matricula.toLowerCase() === matricula.toLowerCase())) {
    alert("Já existe um funcionário com essa matrícula."); return;
  }
  funcionarios.push({ id: proximoId(funcionarios), nome, matricula, cargo });
  evento.target.reset(); salvarDados(); renderTudo();
});

document.querySelector("#form-emprestimo").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const idFuncionario = Number(document.querySelector("#emprestimo-funcionario").value);
  const idNadador = Number(document.querySelector("#emprestimo-nadador").value);
  const idToalha = Number(document.querySelector("#emprestimo-toalha").value);
  const funcionario = localizarFuncionario(idFuncionario);
  const nadador = localizarNadador(idNadador);
  const toalha = localizarToalha(idToalha);
  if (!funcionario || !nadador || !toalha || toalha.status !== "disponivel") {
    mostrarMensagem("Selecione um funcionário, nadador e toalha disponível válidos.", "erro"); return;
  }
  // Validação na rotina que grava o empréstimo (não depende apenas do botão/interface).
  if (nadador.podeRetirarToalhas !== true) {
    mostrarMensagem("Empréstimo bloqueado: este nadador está sem permissão para retirar toalhas.", "erro"); return;
  }
  emprestimos.push({
    id: proximoId(emprestimos), idFuncionario, idNadador, idToalha,
    dataHoraRetirada: new Date().toISOString(), dataHoraDevolucao: null
  });
  toalha.status = "em_uso";
  salvarDados(); renderTudo();
  mostrarMensagem(`Empréstimo registrado para ${nadador.nome}.`, "sucesso");
});
document.querySelector("#lista-emprestimos").addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-devolver]");
  if (!botao) return;
  const emprestimo = emprestimos.find((m) => Number(m.id) === Number(botao.dataset.devolver));
  if (!emprestimo || emprestimo.dataHoraDevolucao) return;
  emprestimo.dataHoraDevolucao = new Date().toISOString();
  const toalha = localizarToalha(Number(emprestimo.idToalha));
  if (toalha) toalha.status = "disponivel";
  salvarDados(); renderTudo();
  mostrarMensagem("Devolução registrada com sucesso.", "sucesso");
});

renderTudo();
salvarDados();
