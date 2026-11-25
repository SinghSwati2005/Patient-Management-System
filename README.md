# Patient Admission Management System

A full-stack web application for managing hospital patient admissions. It allows users to add, view, search, filter, update, discharge, and delete patient records through a responsive interface.

## Live Application

- **Frontend:** [LIVE](https://patient-management-system-neon.vercel.app/)
- **Backend API:** https://patient-management-system-1fwv.onrender.com

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Axios
- CSS

### Backend
- Python
- Flask
- Flask-CORS
- PyMongo

### Database
- MongoDB Atlas

### Deployment
- Vercel – Frontend
- Render – Backend

## Features

- Add new patient records.
- View all admitted and discharged patients.
- Search patients by name.
- Filter records by ward, department, and doctor.
- Edit existing patient details.
- Delete patient records with confirmation.
- Mark patients as discharged.
- Frontend and backend input validation.
- Responsive interface for desktop, tablet, and mobile devices.
- Persistent patient records using MongoDB Atlas.

## Patient Details

Each patient record contains:

- Name
- Age
- Gender
- Ward
- Department
- Doctor
- Admission Date
- Admission Status (Admitted / Discharged)

## Validation

The application implements validation on both the frontend and backend.

- Patient name is required and accepts letters and spaces only.
- Age must be a whole number between 0 and 120.
- Gender, ward, department, and doctor must be selected.
- Admission date is required and cannot be a future date.
- Invalid requests are rejected by the backend with appropriate error messages.

## Project Structure

```text
Patient-Management-System/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── validators.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## Running Locally

### Prerequisites
- Python 3
- Node.js and npm
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/SinghSwati2005/Patient-Management-System.git
cd Patient-Management-System
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
```

Start the Flask server:

```bash
python app.py
```

The backend will run at:

`http://127.0.0.1:5000`

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:5000
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/patients` | Add a patient |
| GET | `/patients` | Retrieve patients |
| GET | `/patients/:id` | Retrieve a specific patient |
| PUT | `/patients/:id` | Update patient details |
| DELETE | `/patients/:id` | Delete a patient |
| PATCH | `/patients/:id/discharge` | Mark patient as discharged |

The GET `/patients` endpoint supports query parameters for name search and filtering by ward, department, and doctor.



---

**Developed by Swati Singh**  
B.Tech – Information Technology  

