# sqlalchemy library la irunthu create_engine function import panrom
# Purpose:
# Python ↔ MySQL connection create panna

from sqlalchemy import create_engine


# sqlalchemy.orm la irunthu sessionmaker import panrom
# Purpose:
# Database open-close manage panna
# Example:
# Open DB → Work → Close DB

from sqlalchemy.orm import sessionmaker


# declarative_base import panrom
# Purpose:
# Future la database tables Python classes ah create panna
# Example:
#
# class Skill(Base):
#     __tablename__="skills"

from sqlalchemy.ext.declarative import declarative_base



# DATABASE_URL nu oru variable create panrom
# Purpose:
# MySQL database address save panna

DATABASE_URL="mysql+pymysql://root:Nith123$%^@localhost/career_guidance_db"



# mysql+pymysql
# Meaning:
# MySQL database use panrom
# pymysql driver use panrom


# root
# Meaning:
# MySQL username


# password
# Meaning:
# MySQL password
# Replace with your password


# localhost
# Meaning:
# Database same computer la run aaguthu


# career_guidance_db
# Meaning:
# Namma create panna database name




# create_engine() use panni actual connection create panrom
# Purpose:
# Python ↔ MySQL connect

engine=create_engine(DATABASE_URL)



# sessionmaker() use panni session create panrom
# Purpose:
# Database work manage panna

SessionLocal=sessionmaker(

    # Automatic save panna koodathu
    autocommit=False,

    # Automatic update panna koodathu
    autoflush=False,

    # Session engine kooda connect aagum
    bind=engine

)



# Base object create panrom
# Purpose:
# Future la models create panna parent class

Base=declarative_base()