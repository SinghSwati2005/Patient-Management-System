import re
from datetime import date


GENDERS =["Male","Female","Other"]

WARDS = ["General", "ICU", "Private", "Emergency"]


DEPARTMENTS = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine"
]

DOCTORS = [
    "Dr. Roy",
    "Dr. Sen",
    "Dr. Das",
    "Dr. Sharma"
]


STATUSES = ["Admitted", "Discharged"]

def validate_patient(data):

    errors = {}

    #name validate karo
    name = data.get("name")


    if not isinstance(name,str) or not name.strip():
        errors["name"] = "Name is required."

    elif not re.fullmatch(r"[A-Za-z ]+",name.strip()):
        errors["name"]="name must contain only letters and spaces."


        #age validation
        age = data.get("age")

        if age is None or age =="":
            errors["age"] = "Age is required."

        elif isinstance(age,bool) or not isinstance(age,int):
            errors["age"] = "Age must be a whole number."
        elif age< 0 or age>120:
            errors["age"] = "Age must be between 0 and 120."

         # Dropdown validation
    dropdown_fields = {
        "gender": GENDERS,
        "ward": WARDS,
        "department": DEPARTMENTS,
        "doctor": DOCTORS,
        "status": STATUSES
    }

    for field, allowed_values in dropdown_fields.items():
        value = data.get(field)

        if not isinstance(value,str) or value not in allowed_values:
            errors[field] = f"Please select a valid {field}."

            #admission date validation


            admission_date = data.get("admission_date")

            if not isinstance(admission_date,str) or not admission_date:
                errors["admission_date"] = "Admision date is required."
            else:
                try:
                    parsed_date = date.fromisoformat(admission_date)

                    if parsed_date>date.today():
                        errors["admission_date"] = "Admission date cannot be in the future."
                except ValueError:
                    errors["admission_date"] = "Please enter a valid admission date."

    return errors



