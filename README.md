# Bring Your Own Cloud Project Setup.


this is my first full stack project on cloud management
- **Backend**: Django (in `byoc_backend`)
- **Frontend**: React + Tailwind (in `byoc_frontend`)

## 1. Start the Backend
1. Open a terminal.
2. Navigate to `byoc_backend`:
   ```cmd
   cd byoc_backend
   ```
3. Run the server:
   ```cmd
   python manage.py runserver
   ```
   The backend will run on `http://127.0.0.1:8000`.

## 2. Start the Frontend
1. Open a **new** terminal.
2. Navigate to `byoc_frontend`:
   ```cmd
   cd byoc_frontend
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the development server:
   ```cmd
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173`.

## 3. Usage
- Open `http://localhost:5173` in your browser.
- **Signup** for a new account.
- **Login** to access your dashboard.
- Click **Connect Cloud** to link a mock AWS/GCP/Azure account.
- Click **View Resources** to see the simulated cloud resources.
