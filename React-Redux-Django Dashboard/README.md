
ReactJS + Redux + Django Dashboard for Timing Testbed Monitoring

Dependencies: 

    django
    django-rest-framework
    django-webpack-loader
    database software (I am using postgres)
    node (If you want to use hot-reloading)
    pyshark
    pyshark-parser
    
    
to setup postgres (MACOSX):

    install Homebrew (if you do not already have it)
    run brew install postgres
    run brew services start postgresql
    run psql postrges
    create user to acess the database from django ( CREATE ROLE kgb WITH LOGIN PASSWORD '1qaz!QAZ1qaz';)
    grant privileges for the database to this user ( GRANT ALL PRIVILEGES ON DATABASE timing_testbed TO kgb;)
    
    
to run dashboard:

    manage.py shell  (if you need to test whether django is connecting to your database)
    manage.py makemigrations  (once you have your database set up and connecting to django)
    manage.py migrate (to generate sql code in your database to make your tables based on your models)
    manage.py runserver ( to run the django web server)
    node server.js  (to run the webpack-connected server to enable hot-reloading)
