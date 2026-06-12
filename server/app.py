from flask import Flask, request, session
from flask_cors import CORS
from config import db, migrate, bcrypt
from models import User, Wedding, BudgetItem, Vendor

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///planly.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
ap.config["SECRET_KEY"] ="dev-secret-key"

app.json.compact = False

CORS(app, supports_credentials=True)

db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)


@app.get("/")
def index():
    return{"message": "Planly Ever After API"}


if __name__ == "__main__":
    app.run(port=5555, debug=True)

    