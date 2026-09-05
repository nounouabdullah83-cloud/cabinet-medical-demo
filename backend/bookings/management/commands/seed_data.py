import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from bookings.models import Booking
from services.models import Service


SERVICES = [
    {
        "title": "General Practice",
        "description": "Comprehensive primary healthcare consultations for patients of all ages.",
        "price": 300,
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    },
    {
        "title": "Cardiology",
        "description": "Specialized diagnostics and treatment for heart and cardiovascular conditions.",
        "price": 500,
        "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    },
    {
        "title": "Pediatrics",
        "description": "Healthcare services tailored for infants, children, and adolescents.",
        "price": 350,
        "image": "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800&q=80",
    },
    {
        "title": "Laboratory",
        "description": "Full range of clinical laboratory tests and diagnostic screenings.",
        "price": 250,
        "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    },
    {
        "title": "Dermatology",
        "description": "Expert skin, hair, and nail care with advanced treatment options.",
        "price": 400,
        "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    },
    {
        "title": "Dentistry",
        "description": "Complete dental care including cleanings, fillings, and cosmetic procedures.",
        "price": 450,
        "image": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    },
    {
        "title": "Ophthalmology",
        "description": "Comprehensive eye examinations, vision correction, and eye disease treatment.",
        "price": 380,
        "image": "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800&q=80",
    },
    {
        "title": "Orthopedics",
        "description": "Specialized care for musculoskeletal injuries and conditions.",
        "price": 550,
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    },
    {
        "title": "Psychology",
        "description": "Mental health support, therapy, and psychological assessments.",
        "price": 400,
        "image": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
    },
    {
        "title": "ENT",
        "description": "Diagnosis and treatment of ear, nose, and throat disorders.",
        "price": 420,
        "image": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80",
    },
    {
        "title": "Gynecology",
        "description": "Women's reproductive health, prenatal care, and wellness exams.",
        "price": 450,
        "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    },
    {
        "title": "Urology",
        "description": "Expert care for urinary tract and male reproductive system conditions.",
        "price": 480,
        "image": "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&q=80",
    },
    {
        "title": "Emergency Medicine",
        "description": "Immediate and urgent medical care for acute conditions and injuries.",
        "price": 600,
        "image": "https://images.unsplash.com/photo-1587745416920-bd8c1ba48154?w=800&q=80",
    },
    {
        "title": "Vaccination",
        "description": "Routine and travel vaccinations for all ages.",
        "price": 200,
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    },
    {
        "title": "Physiotherapy",
        "description": "Rehabilitation and physical therapy for injury recovery and pain management.",
        "price": 350,
        "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    },
    {
        "title": "Nutrition & Dietetics",
        "description": "Personalized nutrition counseling and dietary planning.",
        "price": 300,
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    },
]

FIRST_NAMES = [
    "Ahmed", "Fatima", "Youssef", "Amina", "Mohamed", "Khadija", "Omar", "Sara",
    "Hamza", "Nadia", "Rachid", "Leila", "Karim", "Zineb", "Hassan", "Meryem",
    "Driss", "Salma", "Amine", "Hajar", "Said", "Raja", "Taha", "Asmae",
    "Ali", "Imane", "Mehdi", "Najat", "Walid", "Samira", "Mounir", "Hanane",
    "Bilal", "Sanaa", "Reda", "Loubna", "Ayoub", "Khouloud", "Yassine", "Siham",
]

LAST_NAMES = [
    "El Amrani", "Benali", "Alaoui", "Berrada", "Chakir", "Idrissi", "Tazi",
    "Bennani", "Filali", "Ait Ouazza", "Mansouri", "Ziani", "Bouzidi", "Jabri",
    "Moussaoui", "Chraibi", "Fassi", "Ait Brahim", "Kettani", "Oukhouya",
    "Lahlou", "Toufiq", "Chaoui", "Bennouna", "Daoudi", "Lamrani", "Gharbi",
    "Bouchama", "Hamdaoui", "Slaoui",
]


class Command(BaseCommand):
    help = "Seed the database with fake services and bookings"

    def add_arguments(self, parser):
        parser.add_argument(
            "--bookings", type=int, default=60, help="Number of fake bookings (default: 60)"
        )

    def handle(self, *args, **options):
        num_bookings = options["bookings"]

        services = []
        for s in SERVICES:
            obj, created = Service.objects.get_or_create(
                title=s["title"],
                defaults={"description": s["description"], "price": s["price"], "image": s["image"]},
            )
            services.append(obj)
            if created:
                self.stdout.write(f"  + Service: {obj.title}")

        self.stdout.write(f"{len(services)} services ready")

        bookings = []
        now = timezone.now()
        for i in range(num_bookings):
            svc = random.choice(services)
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            days_ago = random.randint(0, 90)
            date = (now - timedelta(days=days_ago)).date()
            hour = random.choice([8, 9, 10, 11, 13, 14, 15, 16])
            minute = random.choice([0, 15, 30, 45])
            status = random.choices(["pending", "done", "cancelled"], weights=[40, 40, 20], k=1)[0]

            b = Booking(
                full_name=f"{first} {last}",
                age=random.randint(4, 85),
                service=svc,
                preferred_date=date,
                preferred_time=f"{hour:02d}:{minute:02d}",
                email=f"{first.lower()}.{last.lower().replace(' ', '')}@email.com",
                phone_number=f"06{random.randint(10000000, 99999999)}",
            )
            bookings.append((b, status))

        for b, _ in bookings:
            b.save()

        done_count = sum(1 for _, s in bookings if s == "done")
        cancelled_count = sum(1 for _, s in bookings if s == "cancelled")
        pending_count = sum(1 for _, s in bookings if s == "pending")

        self.stdout.write(
            f"\n{len(bookings)} bookings created "
            f"({done_count} done, {cancelled_count} cancelled, {pending_count} pending)"
        )
        self.stdout.write(self.style.SUCCESS("Done!"))
