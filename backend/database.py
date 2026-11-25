import os
from pymongo import MongoClient
from dotenv import load_dotenv

# load env 

load_dotenv()


#read mongo string

MONGO_URI = os.getenv("MONGO_URI")


#connect to mongo atlas
client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)


#select database

db = client["patient_admission_db"]


#selecting patients collection

patients_collection = db["patients"]

#test database connection

def test_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected succesfully!")
    except Exception as error:
        print("MongoDBonnection failure:",error)


#     '''MongoClient() establishes a connection between Python and MongoDB.
# db represents our patient database.
# patients_collection represents the collection where patient records will be stored.
# ping checks whether MongoDB is reachable.
# '''