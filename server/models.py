from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    wedding = db.relationship(
        "Wedding",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class Wedding(db.Model):
    __tablename__ = "weddings"

    id = db.Column(db.Integer, primary_key=True)
    partner_one_name = db.Column(db.String, nullable=False)
    partner_two_name = db.Column(db.String, nullable=False)
    wedding_date = db.Column(db.String)
    venue = db.Column(db.String)
    estimated_guest_count = db.Column(db.Integer)
    total_budget = db.Column(db.Float)
    theme = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="wedding")

    budget_items = db.relationship(
        "BudgetItem",
        back_populates="wedding",
        cascade="all, delete-orphan"
    )

    vendors = db.relationship(
        "Vendor",
        back_populates="wedding",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return{
            "id": self.id,
            "partner_one_name": self.partner_one_name,
            "partner_two_name": self.partner_two_name,
            "wedding_date": self.wedding_date,
            "venue": self.venue,
            "estimated_guest_count": self.estimated_guest_count,
            "total_budget": self.total_budget,
            "theme": self.theme,
            "user_id": self.user_id
        }


class BudgetItem(db.Model):
    __tablename__ = "budget_items"

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    estimated_cost = db.Column(db.Float, default=0)
    actual_cost = db.Column(db.Float, default=0)
    paid = db.Column(db.Boolean, default=False)
    notes = db.Column(db.String)

    wedding_id = db.Column(db.Integer, db.ForeignKey("weddings.id"), nullable=False)

    wedding = db.relationship("Wedding", back_populates="budget_items")

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "description": self.description,
            "estimated_cost": self.estimated_cost,
            "actual_cost": self.actual_cost,
            "paid": self.paid,
            "notes": self.notes,
            "wedding_id": self.wedding_id
        }


class Vendor(db.Model):
    __tablename__ = "vendors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    contact_name = db.Column(db.String)
    contact_email = db.Column(db.String)
    phone = db.Column(db.String)
    quoted_price = db.Column(db.Float, default=0)
    status = db.Column(db.String, default="Researching")
    rating = db.Column(db.Integer)
    notes = db.Column(db.String)

    wedding_id = db.Column(db.Integer, db.ForeignKey("weddings.id"), nullable=False)

    wedding = db.relationship("Wedding", back_populates="vendors")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "contact_name": self.contact_name,
            "contact_email": self.contact_email,
            "phone": self.phone,
            "quoted_price": self.quoted_price,
            "status": self.status,
            "rating": self.rating,
            "notes": self.notes,
            "wedding_id": self.wedding_id
        }

