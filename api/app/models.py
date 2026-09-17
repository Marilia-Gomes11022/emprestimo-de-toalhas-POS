from datetime import datetime
from app import db


class Funcionario(db.Model):
    __tablename__ = "funcionarios"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    matricula = db.Column(db.String(40), unique=True, nullable=False)
    cargo = db.Column(db.String(80), nullable=False)

    movimentacoes = db.relationship("Movimentacao", back_populates="funcionario")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "matricula": self.matricula,
            "cargo": self.cargo,
        }


class Nadador(db.Model):
    __tablename__ = "nadadores"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    documento = db.Column(db.String(40), unique=True, nullable=False)
    turma = db.Column(db.String(60), nullable=False)

    movimentacoes = db.relationship("Movimentacao", back_populates="nadador")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "documento": self.documento,
            "turma": self.turma,
        }


class Toalha(db.Model):
    __tablename__ = "toalhas"

    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(40), unique=True, nullable=False)
    tamanho = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="disponivel")

    movimentacoes = db.relationship("Movimentacao", back_populates="toalha")

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "tamanho": self.tamanho,
            "status": self.status,
        }


class Movimentacao(db.Model):
    __tablename__ = "movimentacoes"

    id = db.Column(db.Integer, primary_key=True)
    id_funcionario = db.Column(db.Integer, db.ForeignKey("funcionarios.id"), nullable=False)
    id_nadador = db.Column(db.Integer, db.ForeignKey("nadadores.id"), nullable=False)
    id_toalha = db.Column(db.Integer, db.ForeignKey("toalhas.id"), nullable=False)
    data_hora_retirada = db.Column(db.DateTime, nullable=False, default=datetime.now)
    data_hora_devolucao = db.Column(db.DateTime, nullable=True)

    funcionario = db.relationship("Funcionario", back_populates="movimentacoes")
    nadador = db.relationship("Nadador", back_populates="movimentacoes")
    toalha = db.relationship("Toalha", back_populates="movimentacoes")

    def to_dict(self):
        return {
            "id": self.id,
            "id_funcionario": self.id_funcionario,
            "id_nadador": self.id_nadador,
            "id_toalha": self.id_toalha,
            "data_hora_retirada": self.data_hora_retirada.isoformat(sep=" ", timespec="seconds")
            if self.data_hora_retirada
            else None,
            "data_hora_devolucao": self.data_hora_devolucao.isoformat(sep=" ", timespec="seconds")
            if self.data_hora_devolucao
            else None,
            "funcionario": self.funcionario.to_dict() if self.funcionario else None,
            "nadador": self.nadador.to_dict() if self.nadador else None,
            "toalha": self.toalha.to_dict() if self.toalha else None,
        }
