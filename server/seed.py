from app import app
from config import db
from models import User, Wedding, BudgetItem, Vendor


with app.app_context():
    print("Clearing database...")

    Vendor.query.delete()
    BudgetItem.query.delete()
    Wedding.query.delete()
    User.query.delete()

    print("Creating demo user...")

    user = User(
        username="zach",
        email="zach@test.com"
    )
    user.password_hash = "password123"

    wedding = Wedding(
        partner_one_name="Zach",
        partner_two_name="Destiny",
        wedding_date="2027-06-20",
        venue="TBD",
        estimated_guest_count=150,
        total_budget=75000,
        theme="Romantic modern elegant",
        user=user
    )

    budget_item_1 = BudgetItem(
        category="Venue",
        description="Venue deposit",
        estimated_cost=25000,
        actual_cost=5000,
        paid=True,
        notes="Initial deposit paid.",
        wedding=wedding
    )

    budget_item_2 = BudgetItem(
        category="Photography",
        description="Photo and video package",
        estimated_cost=6000,
        actual_cost=0,
        paid=False,
        notes="Compare two vendors.",
        wedding=wedding
    )

    vendor_1 = Vendor(
        name="Rosewood Hall",
        category="Venue",
        contact_name="Sara",
        contact_email="sara@example.com",
        phone="555-123-4567",
        quoted_price=25000,
        status="Contacted",
        rating=4,
        notes="Beautiful space, waiting on updated package.",
        wedding=wedding
    )

    vendor_2 = Vendor(
        name="Lens & Love Photography",
        category="Photography",
        contact_name="Mia",
        contact_email="mia@example.com",
        phone="555-555-5555",
        quoted_price=6000,
        status="Quote Received",
        rating=5,
        notes="Strong portfolio.",
        wedding=wedding
    )

    db.session.add(user)
    db.session.add(wedding)
    db.session.add_all([budget_item_1, budget_item_2, vendor_1, vendor_2])

    db.session.commit()

    print("Database seeded!")