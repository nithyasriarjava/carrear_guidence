# fastapi library la irunthu FastAPI import panrom
#
# from
# Meaning:
# Enga irunthu edukanum
#
# fastapi
# Meaning:
# Library name
#
# import
# Meaning:
# Use panna import panrom
#
# FastAPI
# Meaning:
# Main FastAPI application create panna class

from fastapi import FastAPI




# routes folder la iruka skills.py file la
# router object import panrom
#
# from
# Meaning:
# Enga irunthu import panrom
#
# routes.skills
# Meaning:
# routes folder → skills.py
#
# router
# Meaning:
# skills.py la create panna router object
#
# as skills_router
# Meaning:
# Easy name kudukrom

from routes.skills import router as skills_router




# FastAPI object create panrom
#
# app
# Meaning:
# Variable name
#
# =
# Meaning:
# Value assign panrom
#
# FastAPI()
# Meaning:
# Main application create pannum

app = FastAPI()




# Main app kooda skills router connect panrom
#
# include_router()
#
# Meaning:
# External API file ah app-kulla add pannum
#
# Without this:
#
# skills.py create pannalum
# API work aagathu

app.include_router(

    skills_router

)




# GET API create panrom
#
# @
# Meaning:
# Decorator
#
# app.get("/")
#
# Meaning:
# Browser la
#
# http://localhost:8000
#
# open pannina
#
# keela iruka function run aagum

@app.get("/")




# Function create panrom
#
# def
# Meaning:
# Function create panna keyword
#
# home
# Meaning:
# Function name

def home():



    # return
    #
    # Meaning:
    # User-ku response send pannum

    return {

        # JSON object send panrom
        #
        # message
        # key
        #
        # "Career Guidance Backend Running"
        # value

        "message":"Career Guidance Backend Running"

    }