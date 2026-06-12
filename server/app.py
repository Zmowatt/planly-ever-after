from flask import Flask, request, session
from flask_cors import CORS
from config import db, migrate, bcrypt
from models import User, Wedding, BudgetItem, Vendor

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///planly.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] ="dev-secret-key"

app.json.compact = False

CORS(app, supports_credentials=True)

db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)


@app.get("/")
def index():
    return{"message": "Planly Ever After API"}

def get_current_user():
    return User.query.get(session.get("user_id"))

@app.post("/api/signup")
def signup():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return {"error": "Username, email, and password are required."}, 400

    if User.query.filter_by(username=username).first():
        return {"error": "Username already exists."}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email already exists."}, 400

    user = User(username=username, email=email)
    user.password_hash = password

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return user.to_dict(), 201


@app.post("/api/login")
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and user.authenticate(password):
        session["user_id"] = user.id
        return user.to_dict(), 200

    return {"error": "Invalid username or password."}, 401


@app.delete("/api/logout")
def logout():
    session.pop("user_id", None)
    return {}, 204


@app.get("/api/check_session")
def check_session():
    user = get_current_user()

    if user:
        return user.to_dict(), 200

    return {"error": "Unauthorized."}, 401

if __name__ == "__main__":
    app.run(port=5555, debug=True)

