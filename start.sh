#!/bin/bash
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt

python manage.py loaddata data.json
python manage.py migrate

cd backend
python manage.py runserver &
cd ../frontend
npm install
npm run dev
