import { Toalha } from "./Toalha.js";
export class ToalhaManutencao extends Toalha {
  constructor(dados) {
    super({ ...dados, status: "manutencao", tipo: "manutencao" });
    this.observacao = dados.observacao || "Aguardando lavanderia";
  }
}
