(function () {
  let proximoId = 1;

  class Entidade {
    constructor(id = null) {
      this.id = id === null ? proximoId++ : Number(id);
      proximoId = Math.max(proximoId, this.id + 1);
    }
  }

  class Funcionario extends Entidade {
    constructor(nome, matricula, cargo, id = null) {
      super(id);
      this.nome = nome;
      this.matricula = matricula;
      this.cargo = cargo;
    }
  }

  class Nadador extends Entidade {
    constructor(nome, documento, turma, id = null) {
      super(id);
      this.nome = nome;
      this.documento = documento;
      this.turma = turma;
    }
  }

  class Toalha extends Entidade {
    constructor(codigo, tamanho, status = "disponivel", id = null) {
      super(id);
      this.codigo = codigo;
      this.tamanho = tamanho;
      this.status = status;
    }
  }

  class Movimentacao extends Entidade {
    constructor(funcionario, nadador, toalha, retirada = new Date().toISOString(), devolucao = null, id = null) {
      super(id);
      if (!(funcionario instanceof Funcionario) || !(nadador instanceof Nadador) || !(toalha instanceof Toalha)) {
        throw new TypeError("A movimentação exige referências válidas de funcionário, nadador e toalha.");
      }
      this.funcionario = funcionario;
      this.nadador = nadador;
      this.toalha = toalha;
      this.retirada = retirada;
      this.devolucao = devolucao;
    }
  }

  window.Modelos = { Funcionario, Nadador, Toalha, Movimentacao };
})();
