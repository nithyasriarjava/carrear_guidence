# pydantic library la irunthu BaseModel import panrom
# Purpose:
# API request/response format create panna use aagum

from pydantic import BaseModel



# SkillResponse nu oru schema class create panrom
# Purpose:
# Skill data API response la epdi return aaganum nu define pannum

class SkillResponse(BaseModel):


    # id variable create panrom
    # :
    # Type annotation use panrom
    # int = integer(number)

    id:int


    # skill_name variable create panrom
    # str = string(text)

    skill_name:str



    # Config class create panrom
    # Purpose:
    # SQLAlchemy model data ah schema-ku convert panna

    class Config:


        # SQLAlchemy object attributes read panna allow pannum

        from_attributes=True