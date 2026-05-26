# fastapi la irunthu APIRouter and Depends import panrom
# APIRouter → separate API create panna
# Depends → function automatic ah call panna

from fastapi import APIRouter, Depends


# Database session manage panna

from sqlalchemy.orm import Session


# database.py la irunthu DB connection import panrom

from database import SessionLocal


# models.py la irunthu Skill class import panrom

from models import Skill


# schemas.py la irunthu response format import panrom

from schemas import SkillResponse



# Router object create panrom

router = APIRouter()




# Database open → work → close

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()




# GET API create panrom
#
# Browser:
# http://localhost:8000/skills

@router.get(
    "/skills",
    response_model=list[SkillResponse]
)

def get_skills(
    db: Session = Depends(get_db)
):


    # skills table la iruka
    # ella rows um fetch pannum

    skills = db.query(
        Skill
    ).all()


    # data return pannum

    return skills