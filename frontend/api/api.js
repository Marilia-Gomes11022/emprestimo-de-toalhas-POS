const BASE_URL = "http://127.0.0.1:5000";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        ...(opcoes.headers || {})
      }
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao backend Flask. Confira se a API está executando em http://127.0.0.1:5000.");
  }

  const texto = await resposta.text();
  let corpo = null;
  if (texto) {
    try { corpo = JSON.parse(texto); }
    catch { corpo = { erro: texto }; }
  }

  if (!resposta.ok) {
    throw new ApiError(corpo?.erro || corpo?.mensagem || corpo?.message || `Erro HTTP ${resposta.status}`, resposta.status);
  }
  return corpo;
}

const rotas = {
  nadadores: "/nadadores",
  funcionarios: "/funcionarios",
  toalhas: "/toalhas",
  emprestimos: "/movimentacoes"
};

function normalizarMovimentacao(item) {
  return {
    ...item,
    idFuncionario: item.id_funcionario,
    idNadador: item.id_nadador,
    idToalha: item.id_toalha,
    dataHoraRetirada: item.data_hora_retirada,
    dataHoraDevolucao: item.data_hora_devolucao,
    funcionario: item.funcionario,
    nadador: item.nadador,
    toalha: item.toalha
  };
}

function normalizar(recurso, dados) {
  if (Array.isArray(dados)) return dados.map(item => normalizar(recurso, item));
  if (!dados || typeof dados !== "object") return dados;
  if (recurso === "nadadores") {
    return { ...dados, podeRetirarToalhas: dados.pode_retirar_toalhas ?? true };
  }
  if (recurso === "emprestimos") return normalizarMovimentacao(dados);
  return dados;
}

function preparar(recurso, dados) {
  const copia = { ...dados };
  if (recurso === "nadadores" && "podeRetirarToalhas" in copia) {
    copia.pode_retirar_toalhas = copia.podeRetirarToalhas;
    delete copia.podeRetirarToalhas;
  }
  return copia;
}

export const api = {
  listar: async recurso => normalizar(recurso, await requisicao(rotas[recurso])),
  buscar: async (recurso, id) => normalizar(recurso, await requisicao(`${rotas[recurso]}/${id}`)),
  criar: async (recurso, dados) => normalizar(recurso, await requisicao(rotas[recurso], {
    method: "POST", body: JSON.stringify(preparar(recurso, dados))
  })),
  atualizar: async (recurso, id, dados) => normalizar(recurso, await requisicao(`${rotas[recurso]}/${id}`, {
    method: "PUT", body: JSON.stringify(preparar(recurso, dados))
  })),
  atualizarParcial: async (recurso, id, dados) => {
    const corpo = preparar(recurso, dados);
    return normalizar(recurso, await requisicao(`${rotas[recurso]}/${id}/permissao`, {
      method: "PATCH", body: JSON.stringify(corpo)
    }));
  },
  excluir: async (recurso, id) => requisicao(`${rotas[recurso]}/${id}`, { method: "DELETE" }),
  registrarRetirada: async ({ idFuncionario, idNadador, idToalha }) => normalizar("emprestimos", await requisicao("/movimentacoes/retirada", {
    method: "POST",
    body: JSON.stringify({ id_funcionario: idFuncionario, id_nadador: idNadador, id_toalha: idToalha })
  })),
  registrarDevolucao: async ({ idToalha, idFuncionario }) => normalizar("emprestimos", await requisicao("/movimentacoes/devolucao", {
    method: "POST",
    body: JSON.stringify({ id_toalha: idToalha, id_funcionario: idFuncionario })
  }))
};
