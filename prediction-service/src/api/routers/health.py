from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def root():

    return {

        "service": "IntelliStock AI Prediction Service",

        "version": "1.0.0",

        "status": "running",
    }


@router.get("/health")
def health():

    return {

        "status": "healthy",
    }