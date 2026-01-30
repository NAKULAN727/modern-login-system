# Modern Login System

A professional, enterprise-grade authentication system featuring a dual-database architecture, stateless session management, and a modern responsive UI.

##  Features

- **Dual-Database Storage**:
  - **MySQL** for secure credential storage (Email/Password).
  - **MongoDB** for flexible user profile data (Name, DOB, Address, etc.).
- **Stateless Authentication**: Pure token-based system using **Redis** for session management (with MySQL fallback). No PHP sessions (`$_SESSION`) are used.
- **Modern UI/UX**:
  - Responsive **Bootstrap 5** layouts.
  - Custom CSS styling with gradients and glassmorphism effects.
  - **Toast Notifications** for success/error alerts (replacing browser alerts).
- **Secure**:
  - BCrypt password hashing.
  - Prepared SQL statements (SQL Injection protection).
  - Strict JSON API communication.

##  Tech Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, jQuery, Bootstrap Icons.
- **Backend**: PHP (Vanilla).
- **Databases**:
  - MySQL (Relational Data).
  - MongoDB (NoSQL Data).
  - Redis (In-memory Session Store).

##  Project Structure

```
Modern-Login-System/
├── css/
│   ├── style.css           # Global styles & Toast styles
│   └── login_style.css     # Login specific styles
├── js/
│   ├── login.js            # Login AJAX logic
│   ├── register.js         # Registration AJAX logic
│   ├── profile.js          # Profile fetch/update logic
│   └── notifications.js    # Toast notification class
├── php/
│   ├── db_mysql.php        # MySQL Connection
│   ├── db.php              # MongoDB Connection
│   ├── login.php           # Auth Endpoint
│   ├── register.php        # Registration Endpoint
│   └── profile.php         # Profile API Endpoint
├── login.html              # Login Page
├── register.html           # Registration Page
├── profile.html            # User Profile Page
└── README.md
```

##  Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:

- PHP (via XAMPP/WAMP/Laragon)
- MySQL
- MongoDB Server
- Redis Server (Optional, but recommended for high performance)
- Composer (for PHP dependencies if applicable)

### 2. Database Configuration

#### MySQL

Create a database named `login_system` (or update `php/db_mysql.php`) and run the following SQL:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### MongoDB

Ensure MongoDB is running on the default port `27017`. The application will automatically create the `profiles` collection within the database specified in `php/db.php`.

#### Redis

Ensure Redis is running on port `6379`. If Redis is not detected, the system automatically falls back to the MySQL `sessions` table.

### 3. Running the Project

1.  Clone or download the repository to your web server's root directory (e.g., `htdocs` in XAMPP).
2.  Start **Apache**, **MySQL**, **MongoDB**, and **Redis**.
3.  Open your browser and navigate to:
    `http://localhost/Modern-Login-System/login.html`

##  Usage Flow

1.  **Register**: Create a new account. Profile data is saved to MongoDB, login credentials to MySQL.
2.  **Login**: Authenticate using email and password. A token is generated and stored in Redis.
3.  **Profile**: View and update your details. The page is protected and requires a valid token in the headers.

##  Contributing

Feel free to fork this project and submit pull requests.

---

_Built for modern web application requirements emphasizing security and scalability._
