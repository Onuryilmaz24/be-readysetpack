# be-Ready Set Pack

Hello, this is a the backend repo of Ready Set Pack Project.

---

## Hosted Version

 -- [Here](https://readysetpack.onrender.com/api)
 
  (note: spin-up period may take couple of minutes )
---

## Project Summary

This RESTful API powers the backend of ReadySetPack, a travel companion application, offering a structured and efficient way to manage application data. It supports full CRUD operations for handling user profiles, destinations, checklists, and travel-related information. Designed with scalability and reliability in mind, the API is the foundation for the application's frontend.

Key Features:
CRUD Operations: Enables clients to create, read, update, and delete data related to users, destinations, and personalized travel checklists.
Dynamic Data Aggregation: Fetches destination-specific information, including weather, local customs, and travel warnings, through integrated APIs.
MVC Architecture: Developed using the Model-View-Controller (MVC) design pattern to ensure clean, maintainable, and modular code.
PostgreSQL Database: Utilizes PostgreSQL for efficient and reliable data management with advanced querying capabilities.
Test-Driven Development (TDD): Built with Jest to ensure robust functionality and reliability across all endpoints.
A live version of this API is hosted online. Follow the link below to explore detailed documentation, including the full list of available endpoints, example queries, and typical responses. Please allow a minute or two for the server to initialize on first access.

Hosted version of the project: [Here](https://be-readysetpack.onrender.com/api)

For Chrome users, recommend installing a JSON viewer extension to better format the API responses for easier readability.

---

## Table of Contents

1. [Installation](#installation)
2. [Running the Project](#running-the-project)
3. [Environment Variables](#environment-variables)
4. [Technology Stack](#technology-stack)
5. [Testing](#testing)

---

## Installation

### Prerequisites
- **Node.js**: Minimum version `v22.3.0` 
- **Git** installed locally
- **PostgreSQL** Minimum version `v16.4`
- **TypeScript** Minimum version `v5.7.3`


### Steps

1. Clone the repository:
git clone https://github.com/Onuryilmaz24/be-readysetpack.git

2. Install dependencies:
- Dependencies:
    + Posgtres
    + express
    + TypeScript
    + Cors
-Dev Dependencies
    + pg-format
    + dotenv
    + jest
    + jest-sorted
    + nodemon
    + husky
    + supertest
    + axios

To get these running on your machine, run this command in your terminal:
  ```bash
   npm install
   ```      
     
4. Setup Database
   - In order to setup test and development database you need to set up two `.env` files in root directory:
   - .env.test
       - Inside this file you need to write:
         ` PGDATABASE=your_database_test`
   - .env.development
       - Inside this file you need to write:
         ` PGDATABASE=your_database`

5. Set up the local database:
   - Ensure PostgreSQL is running.
   - Create a new database:
     ```bash
     npm run setup-dbs
     ```
6. Seed the database:
   ```bash
   npm run seed
   ```
## Running the Project

1. Start the server:
   ```bash
   npm run start
   ```

---
## Technology Stack

- **Backend**: Node.js, Express,TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Deployment**: Supabase, Render

---

## Testing

Run the test suite with the following command:

```bash
npm run test-ts

```
---
"This project was created by [Onur Yilmaz](https://github.com/Onuryilmaz24) as part of the Digital Skills Bootcamp in Software Engineering course provided by [NorthCoders](https://northcoders.com/)."
