
from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
import re

from database import patients_collection, test_connection
from validators import validate_patient

app = Flask(__name__)
CORS(app)


# Helper function to convert MongoDB documents into JSON-compatible data
def format_patient(patient):
    patient["_id"] = str(patient["_id"])
    return patient


# 1. Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Patient Admission Management API is running!"
    }), 200


# 2. Add a new patient
@app.route("/patients", methods=["POST"])
def add_patient():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Please provide valid patient data."}), 400

    errors = validate_patient(data)

    if errors:
        return jsonify({"errors": errors}), 400

    patient = {
        "name": data["name"].strip(),
        "age": data["age"],
        "gender": data["gender"],
        "ward": data["ward"],
        "department": data["department"],
        "doctor": data["doctor"],
        "admission_date": data["admission_date"],
        "status": data["status"]
    }

    result = patients_collection.insert_one(patient)

    patient["_id"] = str(result.inserted_id)

    return jsonify({
        "message": "Patient added successfully!",
        "patient": patient
    }), 201


# 3. View all patients with search and filters
@app.route("/patients", methods=["GET"])
def get_patients():

    filters = {}

    # Search by patient name
    search = request.args.get("search")

    if search:
        filters["name"] = {
            "$regex": re.escape(search.strip()),
            "$options": "i"
        }

    # Filter by ward, department and doctor
    for field in ["ward", "department", "doctor"]:
        value = request.args.get(field)

        if value:
            filters[field] = value

    patients = list(
        patients_collection.find(filters).sort("_id", -1)
    )

    patients = [format_patient(patient) for patient in patients]

    return jsonify({
        "count": len(patients),
        "patients": patients
    }), 200


# 4. View one patient by ID
@app.route("/patients/<patient_id>", methods=["GET"])
def get_patient(patient_id):

    if not ObjectId.is_valid(patient_id):
        return jsonify({"error": "Invalid patient ID."}), 400

    patient = patients_collection.find_one({
        "_id": ObjectId(patient_id)
    })

    if not patient:
        return jsonify({"error": "Patient not found."}), 404

    return jsonify(format_patient(patient)), 200


# 5. Edit patient details
@app.route("/patients/<patient_id>", methods=["PUT"])
def update_patient(patient_id):

    if not ObjectId.is_valid(patient_id):
        return jsonify({"error": "Invalid patient ID."}), 400

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Please provide valid patient data."}), 400

    errors = validate_patient(data)

    if errors:
        return jsonify({"errors": errors}), 400

    updated_data = {
        "name": data["name"].strip(),
        "age": data["age"],
        "gender": data["gender"],
        "ward": data["ward"],
        "department": data["department"],
        "doctor": data["doctor"],
        "admission_date": data["admission_date"],
        "status": data["status"]
    }

    result = patients_collection.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": updated_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Patient not found."}), 404

    patient = patients_collection.find_one({
        "_id": ObjectId(patient_id)
    })

    return jsonify({
        "message": "Patient updated successfully!",
        "patient": format_patient(patient)
    }), 200


# 6. Delete a patient
@app.route("/patients/<patient_id>", methods=["DELETE"])
def delete_patient(patient_id):

    if not ObjectId.is_valid(patient_id):
        return jsonify({"error": "Invalid patient ID."}), 400

    result = patients_collection.delete_one({
        "_id": ObjectId(patient_id)
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Patient not found."}), 404

    return jsonify({
        "message": "Patient deleted successfully!"
    }), 200


# 7. Mark patient as discharged
@app.route("/patients/<patient_id>/discharge", methods=["PATCH"])
def discharge_patient(patient_id):

    if not ObjectId.is_valid(patient_id):
        return jsonify({"error": "Invalid patient ID."}), 400

    result = patients_collection.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": {"status": "Discharged"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Patient not found."}), 404

    return jsonify({
        "message": "Patient marked as discharged successfully!"
    }), 200


if __name__ == "__main__":
    test_connection()
    app.run(debug=True, port=5000)
