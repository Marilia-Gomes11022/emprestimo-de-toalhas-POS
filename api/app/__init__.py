from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    base = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(base, "toalhas.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    CORS(app)
    db.init_app(app)

    from app.routes import bp

    app.register_blueprint(bp)

    with app.app_context():
        db.create_all()

    return app
