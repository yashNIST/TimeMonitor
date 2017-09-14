
ReactJS + Redux + Django Dashboard for Timing Testbed Monitoring

Dependencies: 

    django
    django-rest-framework
    django-webpack-loader
    database software (I am using postgres)
    node (If you want to use hot-reloading)
    pyshark
    threading
    
to run dashboard:

    manage.py shell  (if you need to test whether django is connecting to your database)
    manage.py makemigrations  (once you have your database set up and connecting to django)
    manage.py migrate (to generate sql code in your database to make your tables based on your models)
    manage.py runserver ( to run the django web server)
    node server.js  (to run the webpack-connected server to enable hot-reloading)
