from datetime import datetime
from flask import Blueprint, jsonify, request
from app import db
from app.models import Funcionario, Nadador, Toalha, Movimentacao

bp = Blueprint("api", __name__)


@bp.get("/")
def raiz():
    return jsonify(
        {
            "sistema": "Controle de Toalhas - Escola de Natacao",
            "endpoints": [
                "/funcionarios",
                "/nadadores",
                "/toalhas",
                "/toalhas/disponiveis",
                "/toalhas/em-uso",
                "/movimentacoes",
                "/movimentacoes/abertas",
                "/movimentacoes/historico/<id_toalha>",
                "/movimentacoes/retirada",
                "/movimentacoes/devolucao",
            ],
        }
    )


@bp.get("/funcionarios")
def listar_funcionarios():
    return jsonify([f.to_dict() for f in Funcionario.query.all()])


@bp.get("/funcionarios/<int:id>")
def obter_funcionario(id):
    item = Funcionario.query.get_or_404(id)
    return jsonify(item.to_dict())


@bp.post("/funcionarios")
def criar_funcionario():
    dados = request.get_json(force=True)
    item = Funcionario(
        nome=dados["nome"],
        matricula=dados["matricula"],
        cargo=dados["cargo"],
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@bp.put("/funcionarios/<int:id>")
def atualizar_funcionario(id):
    item = Funcionario.query.get_or_404(id)
    dados = request.get_json(force=True)
    item.nome = dados.get("nome", item.nome)
    item.matricula = dados.get("matricula", item.matricula)
    item.cargo = dados.get("cargo", item.cargo)
    db.session.commit()
    return jsonify(item.to_dict())


@bp.delete("/funcionarios/<int:id>")
def excluir_funcionario(id):
    item = Funcionario.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"mensagem": "Funcionario removido"})


@bp.get("/nadadores")
def listar_nadadores():
    return jsonify([n.to_dict() for n in Nadador.query.all()])


@bp.get("/nadadores/<int:id>")
def obter_nadador(id):
    item = Nadador.query.get_or_404(id)
    return jsonify(item.to_dict())


@bp.post("/nadadores")
def criar_nadador():
    dados = request.get_json(force=True)
    item = Nadador(
        nome=dados["nome"],
        documento=dados["documento"],
        turma=dados["turma"],
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@bp.put("/nadadores/<int:id>")
def atualizar_nadador(id):
    item = Nadador.query.get_or_404(id)
    dados = request.get_json(force=True)
    item.nome = dados.get("nome", item.nome)
    item.documento = dados.get("documento", item.documento)
    item.turma = dados.get("turma", item.turma)
    db.session.commit()
    return jsonify(item.to_dict())


@bp.delete("/nadadores/<int:id>")
def excluir_nadador(id):
    item = Nadador.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"mensagem": "Nadador removido"})


@bp.get("/toalhas")
def listar_toalhas():
    return jsonify([t.to_dict() for t in Toalha.query.all()])


@bp.get("/toalhas/disponiveis")
def toalhas_disponiveis():
    itens = Toalha.query.filter_by(status="disponivel").all()
    return jsonify([t.to_dict() for t in itens])


@bp.get("/toalhas/em-uso")
def toalhas_em_uso():
    itens = Toalha.query.filter_by(status="em_uso").all()
    return jsonify([t.to_dict() for t in itens])


@bp.get("/toalhas/<int:id>")
def obter_toalha(id):
    item = Toalha.query.get_or_404(id)
    return jsonify(item.to_dict())


@bp.post("/toalhas")
def criar_toalha():
    dados = request.get_json(force=True)
    item = Toalha(
        codigo=dados["codigo"],
        tamanho=dados["tamanho"],
        status=dados.get("status", "disponivel"),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@bp.put("/toalhas/<int:id>")
def atualizar_toalha(id):
    item = Toalha.query.get_or_404(id)
    dados = request.get_json(force=True)
    item.codigo = dados.get("codigo", item.codigo)
    item.tamanho = dados.get("tamanho", item.tamanho)
    item.status = dados.get("status", item.status)
    db.session.commit()
    return jsonify(item.to_dict())


@bp.delete("/toalhas/<int:id>")
def excluir_toalha(id):
    item = Toalha.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"mensagem": "Toalha removida"})


@bp.get("/movimentacoes")
def listar_movimentacoes():
    return jsonify([m.to_dict() for m in Movimentacao.query.all()])


@bp.get("/movimentacoes/abertas")
def movimentacoes_abertas():
    itens = Movimentacao.query.filter(Movimentacao.data_hora_devolucao.is_(None)).all()
    return jsonify([m.to_dict() for m in itens])


@bp.get("/movimentacoes/historico/<int:id_toalha>")
def historico_toalha(id_toalha):
    Toalha.query.get_or_404(id_toalha)
    itens = (
        Movimentacao.query.filter_by(id_toalha=id_toalha)
        .order_by(Movimentacao.data_hora_retirada.desc())
        .all()
    )
    return jsonify([m.to_dict() for m in itens])


@bp.get("/movimentacoes/<int:id>")
def obter_movimentacao(id):
    item = Movimentacao.query.get_or_404(id)
    return jsonify(item.to_dict())


@bp.post("/movimentacoes/retirada")
def registrar_retirada():
    dados = request.get_json(force=True)
    funcionario = Funcionario.query.get(dados["id_funcionario"])
    nadador = Nadador.query.get(dados["id_nadador"])
    toalha = Toalha.query.get(dados["id_toalha"])

    if not funcionario or not nadador or not toalha:
        return jsonify({"erro": "Funcionario, nadador ou toalha nao encontrado"}), 400

    if toalha.status == "em_uso":
        return jsonify({"erro": "Toalha ja esta em uso"}), 400

    item = Movimentacao(
        id_funcionario=funcionario.id,
        id_nadador=nadador.id,
        id_toalha=toalha.id,
        data_hora_retirada=datetime.now(),
    )
    toalha.status = "em_uso"
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@bp.post("/movimentacoes/devolucao")
def registrar_devolucao():
    dados = request.get_json(force=True)
    toalha = Toalha.query.get(dados["id_toalha"])

    if not toalha:
        return jsonify({"erro": "Toalha nao encontrada"}), 400

    item = (
        Movimentacao.query.filter_by(id_toalha=toalha.id, data_hora_devolucao=None)
        .order_by(Movimentacao.data_hora_retirada.desc())
        .first()
    )

    if not item:
        return jsonify({"erro": "Nao ha retirada em aberto para esta toalha"}), 400

    if "id_funcionario" in dados:
        funcionario = Funcionario.query.get(dados["id_funcionario"])
        if funcionario:
            item.id_funcionario = funcionario.id

    item.data_hora_devolucao = datetime.now()
    toalha.status = "disponivel"
    db.session.commit()
    return jsonify(item.to_dict())


@bp.delete("/movimentacoes/<int:id>")
def excluir_movimentacao(id):
    item = Movimentacao.query.get_or_404(id)
    if item.data_hora_devolucao is None and item.toalha:
        item.toalha.status = "disponivel"
    db.session.delete(item)
    db.session.commit()
    return jsonify({"mensagem": "Movimentacao removida"})
