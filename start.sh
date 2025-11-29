#!/bin/bash
python -m venv venv
. venv/Scripts/activate

pip install -r requirements.txt

cd DjangoBackend
python manage.py migrate
python manage.py loaddata data.json
python manage.py runserver &

cd ../ViteReadingApp
npm install
npm run dev
