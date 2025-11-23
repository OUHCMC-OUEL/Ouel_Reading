#!/bin/bash

pip install -r requirements.txt

python manage.py migrate

python manage.py loaddata data.json

cd backend
python manage.py runserver &

cd ../frontend
npm install
npm run dev
