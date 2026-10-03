# Expense Tracker

<!-- Write 1-2 sentences: what does your app do? -->
Expense Tracker is a web application that allows users to add, edit, delete, filter, and sort their expenses. It also provides summary information such as the total amount, number of expenses, and highest expense.
## How to run

<!-- Write the exact steps someone needs to run your project from scratch.
     Assume they have Node.js, PostgreSQL, and VS Code, and nothing else.
     Include: creating the database, running schema.sql, writing the .env file,
     starting the backend, and opening the frontend. -->

**Backend**

1.Open the project in VS Code.
2.Create a PostgreSQL database for the project.
3.Open the PostgreSQL Query Tool and run the schema.sql file to create the required tables and data.
4.Create a .env file in the backend folder and add your PostgreSQL connection details:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=your_password
5.Open the terminal in the backend folder and 
6.install the dependencies:npm install
Start the backend server:node server.js
7.Make sure the backend server is running on the port number you specified  for example:http://localhost:3000
If you choose a different port, use that port number instead.
8
**Frontend**

1.Open the frontend using VS Code Live Server by right-clicking index.html and selecting Open with Live Server.
2.The Expense Tracker application should now be ready to use.

## Features

<!-- List what your app can do. Tick what you finished. -->

- [✓] Add an expense (with validation)
- [✓] Delete an expense
- [✓] Edit an expense
- [✓] Filter by category
- [✓] Summary cards (total, count, highest)
- [✓] Data is saved in a PostgreSQL database
 Bonus
- [✓] Sort expenses by column
- [✓] Dark mode
## Screenshots

<!-- Add 2-3 screenshots of your app (desktop and mobile). -->
-video link
https://drive.google.com/file/d/1DJVeMZpe59ha-8KKVThb49rqBKtdu48D/view?usp=sharing
## What was the hardest part?

<!-- A short paragraph: what got you stuck, and how did you solve it? -->
The hardest part for me was connecting the frontend with the backend and making sure everything worked correctly with the database. I also had some difficulties with validation, editing, and error handling, but I solved the problems and tested the code step by step until everything worked. I really enjoyed the process because it gave me the chance to learn new things, search for solutions, apply what I learned, and see the final result working correctly.
