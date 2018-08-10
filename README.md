# URL Shorter

A simple public service to generate short url based on give url.

## Development

### Requirements
  * [Docker](https://www.docker.com/) - Use docker as dev and prod env.
  * [StandardJS](https://standardjs.com/index.html) - Use standardJS avaScript Style rules.

#### Get Started:

  Start the application:

  ```
    docker-compose up
  ```

#### Database Seeding
  Run the following command line to seed the database, remeber to replace with your own credentials
  ```
    ./seeds/seed localhost:27017 url-shorter urls ./urls.json your_admin_username your_admin_password
  ```

## TODO:

* *1. Protect the api with auth*
* *2. test setup*
