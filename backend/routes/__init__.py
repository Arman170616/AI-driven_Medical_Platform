"""Initialize routes package"""
from .users import router as users_router
from .patients import router as patients_router
from .visits import router as visits_router
from .prescriptions import router as prescriptions_router
from .medical import router as medical_router

__all__ = [
    "users_router",
    "patients_router",
    "visits_router",
    "prescriptions_router",
    "medical_router",
]
