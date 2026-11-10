export class Toalha {
  constructor({ id, codigo, tamanho, status = "disponivel", tipo = "comum", observacao = "" }) {
    this.id = id;
    this.codigo = codigo;
    this.tamanho = tamanho;
    this.status = status;
    this.tipo = tipo;
    this.observacao = observacao;
  }
  get rotuloStatus() {
    return ({ disponivel: "Disponível", em_uso: "Em uso", manutencao: "Manutenção" })[this.status] || this.status;
  }
}
