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
    return {"message": "Planly Ever After API"}

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

@app.get("/api/wedding")
def get_wedding():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    if not user.wedding:
        return {"message": "No wedding profile found."}, 404

    return user.wedding.to_dict(), 200


@app.post("/api/wedding")
def create_wedding():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    if user.wedding:
        return {"error": "Wedding profile already exists."}, 400

    data = request.get_json()

    wedding = Wedding(
        partner_one_name=data.get("partner_one_name"),
        partner_two_name=data.get("partner_two_name"),
        wedding_date=data.get("wedding_date"),
        venue=data.get("venue"),
        estimated_guest_count=data.get("estimated_guest_count"),
        total_budget=data.get("total_budget"),
        theme=data.get("theme"),
        user_id=user.id
    )

    db.session.add(wedding)
    db.session.commit()

    return wedding.to_dict(), 201


@app.patch("/api/wedding/<int:id>")
def update_wedding(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    wedding = Wedding.query.get(id)

    if not wedding:
        return {"error": "Wedding not found."}, 404

    if wedding.user_id != user.id:
        return {"error": "Forbidden."}, 403

    data = request.get_json()

    for field in [
        "partner_one_name",
        "partner_two_name",
        "wedding_date",
        "venue",
        "estimated_guest_count",
        "total_budget",
        "theme"
    ]:
        if field in data:
            setattr(wedding, field, data[field])

    db.session.commit()

    return wedding.to_dict(), 200

@app.get("/api/budget-items")
def get_budget_items():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    if not user.wedding:
        return [], 200

    return [item.to_dict() for item in user.wedding.budget_items], 200


@app.post("/api/budget-items")
def create_budget_item():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    if not user.wedding:
        return {"error": "Create a wedding profile first."}, 400

    data = request.get_json()

    item = BudgetItem(
        category=data.get("category"),
        description=data.get("description"),
        estimated_cost=data.get("estimated_cost", 0),
        actual_cost=data.get("actual_cost", 0),
        paid=data.get("paid", False),
        notes=data.get("notes"),
        wedding_id=user.wedding.id
    )

    db.session.add(item)
    db.session.commit()

    return item.to_dict(), 201


@app.patch("/api/budget-items/<int:id>")
def update_budget_item(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    item = BudgetItem.query.get(id)

    if not item:
        return {"error": "Budget item not found."}, 404

    if not user.wedding or item.wedding_id != user.wedding.id:
        return {"error": "Forbidden."}, 403

    data = request.get_json()

    for field in [
        "category",
        "description",
        "estimated_cost",
        "actual_cost",
        "paid",
        "notes"
    ]:
        if field in data:
            setattr(item, field, data[field])

    db.session.commit()

    return item.to_dict(), 200


@app.delete("/api/budget-items/<int:id>")
def delete_budget_item(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized."}, 401

    item = BudgetItem.query.get(id)

    if not item:
        return {"error": "Budget item not found."}, 404

    if not user.wedding or item.wedding_id != user.wedding.id:
        return {"error": "Forbidden."}, 403

    db.session.delete(item)
    db.session.commit()

    return {}, 204

if __name__ == "__main__":
    app.run(port=5555, debug=True)

