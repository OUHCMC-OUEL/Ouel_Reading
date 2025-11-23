@echo off
call venv\Scripts\activate
pip install -r requirements.txt
start cmd /k "cd backend && python manage.py runserver"
start cmd /k "cd frontend && npm run dev"
