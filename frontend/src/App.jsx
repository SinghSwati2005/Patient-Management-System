import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
  try {
    setLoading(true);

    const response = await api.get("/patients", {
      params: {
        search,
        ward: wardFilter,
        department: departmentFilter,
        doctor: doctorFilter,
      },
    });

    setPatients(response.data.patients);
    setError("");
  } catch (err) {
    setError("Unable to load patients. Please check the backend.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const validateForm = () => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  } else if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
    errors.name = "Name must contain only letters and spaces.";
  }

  if (formData.age === "") {
    errors.age = "Age is required.";
  } else if (
    !Number.isInteger(Number(formData.age)) ||
    Number(formData.age) < 0 ||
    Number(formData.age) > 120
  ) {
    errors.age = "Age must be a whole number between 0 and 120.";
  }

  ["gender", "ward", "department", "doctor"].forEach((field) => {
    if (!formData[field]) {
      errors[field] = `Please select ${field}.`;
    }
  });

  if (!formData.admission_date) {
    errors.admission_date = "Admission date is required.";
  } else if (
    formData.admission_date >
    new Date().toLocaleDateString("en-CA")
  ) {
    errors.admission_date = "Admission date cannot be in the future.";
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
if (!validateForm()) return;
  try {
    const payload = {
      ...formData,
      age: Number(formData.age),
    };

    if (isEditing) {
      await api.put(`/patients/${editingId}`, payload);
      setSuccessMessage("Patient updated successfully!");
    } else {
      await api.post("/patients", payload);
      setSuccessMessage("Patient added successfully!");
    }

    setFormErrors({});
    setEditingId(null);
    setIsEditing(false);

    setFormData({
      name: "",
      age: "",
      gender: "",
      ward: "",
      department: "",
      doctor: "",
      admission_date: "",
      status: "Admitted",
    });

    fetchPatients();
  } catch (err) {
    if (err.response?.data?.errors) {
      setFormErrors(err.response.data.errors);
    } else {
      setFormErrors({
        general: err.response?.data?.error || "Unable to save patient.",
      });
    }
  }
};


const handleEdit = (patient) => {
  setFormData({
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    ward: patient.ward,
    department: patient.department,
    doctor: patient.doctor,
    admission_date: patient.admission_date,
    status: patient.status,
  });

  setEditingId(patient._id);
  setIsEditing(true);
  setSuccessMessage("");
  setFormErrors({});
  window.scrollTo({ top: 0, behavior: "smooth" });
};


const handleDelete = async (patientId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this patient?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`/patients/${patientId}`);
    setSuccessMessage("Patient deleted successfully!");
    fetchPatients();
  } catch (err) {
    setError("Unable to delete patient.");
  }
};

const handleDischarge = async (patientId) => {
  const confirmed = window.confirm(
    "Are you sure you want to mark this patient as discharged?"
  );

  if (!confirmed) return;

  try {
    await api.patch(`/patients/${patientId}/discharge`);
    setSuccessMessage("Patient discharged successfully!");
    fetchPatients();
  } catch (err) {
    setError("Unable to discharge patient.");
  }
};


  useEffect(() => {
    fetchPatients();
  }, []);

const [formData, setFormData] = useState({
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admission_date: "",
  status: "Admitted",
});

const [formErrors, setFormErrors] = useState({});
const [successMessage, setSuccessMessage] = useState("");
const [search, setSearch] = useState("");
const [wardFilter, setWardFilter] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");
const [doctorFilter, setDoctorFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
const [isEditing, setIsEditing] = useState(false);


return (
  <div className="app-container">

    {/* HEADER */}
    <div className="header">
      <h1>Patient Admission Management</h1>
      <p>Manage patient admissions and records efficiently.</p>
    </div>

    {/* PATIENT FORM */}
    <div className="panel">
      <h2>{isEditing ? "Edit Patient Details" : "Admit New Patient"}</h2>

      <form className="patient-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <p className="error-message">{formErrors.name}</p>}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="120"
            required
          />
          {formErrors.age && <p className="error-message">{formErrors.age}</p>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.gender && <p className="error-message">{formErrors.gender}</p>}
        </div>

        <div className="form-group">
          <label>Ward</label>
          <select name="ward" value={formData.ward} onChange={handleChange} required>
            <option value="">Select Ward</option>
            <option value="General">General</option>
            <option value="ICU">ICU</option>
            <option value="Private">Private</option>
            <option value="Emergency">Emergency</option>
          </select>
          {formErrors.ward && <p className="error-message">{formErrors.ward}</p>}
        </div>

        <div className="form-group">
          <label>Department</label>
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Medicine">General Medicine</option>
          </select>
          {formErrors.department && <p className="error-message">{formErrors.department}</p>}
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <select name="doctor" value={formData.doctor} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            <option value="Dr. Roy">Dr. Roy</option>
            <option value="Dr. Sen">Dr. Sen</option>
            <option value="Dr. Das">Dr. Das</option>
            <option value="Dr. Sharma">Dr. Sharma</option>
          </select>
          {formErrors.doctor && <p className="error-message">{formErrors.doctor}</p>}
        </div>

        <div className="form-group">
          <label>Admission Date</label>
          <input
            type="date"
            name="admission_date"
            value={formData.admission_date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
          {formErrors.admission_date && <p className="error-message">{formErrors.admission_date}</p>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">
            {isEditing ? "Update Patient" : "Add Patient"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormErrors({});
                setFormData({
                  name: "",
                  age: "",
                  gender: "",
                  ward: "",
                  department: "",
                  doctor: "",
                  admission_date: "",
                  status: "Admitted",
                });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {formErrors.general && (
          <p className="error-message">{formErrors.general}</p>
        )}

        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

      </form>
    </div>

    {/* SEARCH AND FILTERS */}
    <div className="panel">
      <h2>Search and Filter Patients</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
          <option value="">All Wards</option>
          <option value="General">General</option>
          <option value="ICU">ICU</option>
          <option value="Private">Private</option>
          <option value="Emergency">Emergency</option>
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="General Medicine">General Medicine</option>
        </select>

        <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
          <option value="">All Doctors</option>
          <option value="Dr. Roy">Dr. Roy</option>
          <option value="Dr. Sen">Dr. Sen</option>
          <option value="Dr. Das">Dr. Das</option>
          <option value="Dr. Sharma">Dr. Sharma</option>
        </select>

        <button onClick={fetchPatients}>Apply Filters</button>

        <button
          className="secondary-button"
          onClick={() => {
            setSearch("");
            setWardFilter("");
            setDepartmentFilter("");
            setDoctorFilter("");
            setTimeout(fetchPatients, 0);
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* PATIENT TABLE */}
      <h2>All Patients ({patients.length})</h2>

      {loading && <p>Loading patients...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && patients.length === 0 && (
        <p>No patients found.</p>
      )}

      {patients.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Ward</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.ward}</td>
                  <td>{patient.department}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.admission_date}</td>

                  <td>
                    <span className={`status ${
                      patient.status === "Admitted"
                        ? "status-admitted"
                        : "status-discharged"
                    }`}>
                      {patient.status}
                    </span>
                  </td>

                  <td className="actions">
                    <button onClick={() => handleEdit(patient)}>
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => handleDelete(patient._id)}
                    >
                      Delete
                    </button>

                    {patient.status !== "Discharged" && (
                      <button
                        className="secondary-button"
                        onClick={() => handleDischarge(patient._id)}
                      >
                        Discharge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  </div>
);

}

export default App;