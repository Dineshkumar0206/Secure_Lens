# 🔐 SecureLens – Intelligent Web Threat Analysis & Phishing Detection Platform

A full-stack cybersecurity application that analyzes URLs in real-time for phishing,
spoofing, and web threats using multi-layer heuristic detection.

---

## 📁 Project Structure

```
SecureLens/
├── frontend/                         # React.js Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js             # Top navigation bar
│   │   │   ├── ThreatBadge.js        # SAFE / SUSPICIOUS / PHISHING badge
│   │   │   ├── ThreatMeter.js        # SVG circular risk gauge
│   │   │   ├── StatCard.js           # Dashboard metric card
│   │   │   └── Loader.js             # Animated loading spinner
│   │   ├── pages/
│   │   │   ├── LandingPage.js        # Public hero/marketing page
│   │   │   ├── LoginPage.js          # User login form
│   │   │   ├── RegisterPage.js       # User registration form
│   │   │   ├── DashboardPage.js      # Stats overview + recent scans
│   │   │   ├── ScannerPage.js        # URL analysis input + results
│   │   │   └── HistoryPage.js        # Full scan history + filtering
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance with JWT interceptor
│   │   │   ├── authService.js        # Register / Login / Logout
│   │   │   └── scanService.js        # Scan URL / Get History / Get Stats
│   │   ├── utils/
│   │   │   └── auth.js               # JWT localStorage helpers
│   │   ├── App.js                    # Router + Protected routes
│   │   ├── index.js                  # React DOM entry point
│   │   └── index.css                 # Global CSS variables + styles
│   └── package.json
│
├── backend/                          # Spring Boot Application (Java 17)
│   ├── src/main/java/com/securelens/
│   │   ├── controller/
│   │   │   ├── AuthController.java   # POST /api/auth/register, /login
│   │   │   ├── ScanController.java   # POST /api/scan/url, GET /api/scan/history
│   │   │   └── UserController.java   # GET /api/user/profile
│   │   ├── service/
│   │   │   ├── ScanService.java      # Orchestrates scan + persistence
│   │   │   └── UrlAnalysisService.java # Core phishing detection engine
│   │   ├── repository/
│   │   │   ├── UserRepository.java   # JPA queries for users
│   │   │   └── ScanRepository.java   # JPA queries for scans
│   │   ├── model/
│   │   │   ├── User.java             # User entity (users table)
│   │   │   └── Scan.java             # Scan entity (scans table)
│   │   ├── security/
│   │   │   ├── JwtUtils.java         # JWT generation + validation
│   │   │   ├── JwtAuthenticationFilter.java  # Per-request JWT interceptor
│   │   │   ├── UserDetailsServiceImpl.java   # Spring Security user loader
│   │   │   └── WebSecurityConfig.java        # Security filter chain + CORS
│   │   ├── dto/
│   │   │   └── Dtos.java             # All request/response DTO classes
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java   # Unified error responses
│   │   └── SecureLensApplication.java        # Main entry point
│   ├── src/main/resources/
│   │   └── application.properties    # DB, JWT, CORS configuration
│   └── pom.xml                       # Maven dependencies
│
└── README.md
```

---

## 🗄️ Database Schema

### `users` table
| Column      | Type         | Notes                    |
|-------------|--------------|--------------------------|
| id          | BIGINT PK    | Auto-increment           |
| username    | VARCHAR(50)  | Unique                   |
| email       | VARCHAR(255) | Unique                   |
| password    | VARCHAR(255) | BCrypt hashed            |
| created_at  | DATETIME     | Auto-set on insert       |
| last_login  | DATETIME     | Updated on login         |

### `scans` table
| Column          | Type          | Notes                        |
|-----------------|---------------|------------------------------|
| id              | BIGINT PK     | Auto-increment               |
| url             | VARCHAR(2048) | The analyzed URL             |
| threat_level    | VARCHAR(20)   | SAFE / SUSPICIOUS / PHISHING |
| threat_score    | INT           | 0–100 risk score             |
| risk_percentage | VARCHAR(10)   | e.g. "72%"                   |
| flags           | VARCHAR(2048) | JSON array of issues found   |
| scanned_at      | DATETIME      | Auto-set on insert           |
| user_id         | BIGINT FK     | References users.id          |

---

## ⚙️ Installation & Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ & npm
- MySQL 8.0+

---

### 1. MySQL Database Setup

```sql
-- Connect to MySQL and run:
CREATE DATABASE securelens_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'securelens'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON securelens_db.* TO 'securelens'@'localhost';
FLUSH PRIVILEGES;
```

---

### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/securelens_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=securelens
spring.datasource.password=your_password

app.jwt.secret=YourSuperSecretKeyAtLeast256BitsLongForProductionUse
app.jwt.expiration=86400000
```

---

### 3. Run Spring Boot Backend

```bash
cd SecureLens/backend
mvn clean install
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

---

### 4. Run React Frontend

```bash
cd SecureLens/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🌐 REST API Reference

### Authentication

#### POST `/api/auth/register`
```json
// Request
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}

// Response 200
{
  "success": true,
  "message": "User registered successfully!"
}
```

#### POST `/api/auth/login`
```json
// Request
{
  "username": "john_doe",
  "password": "securepass123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### Scanning (requires `Authorization: Bearer <token>` header)

#### POST `/api/scan/url`
```json
// Request
{
  "url": "http://paypal-secure-login.verify-account.tk/update?id=123"
}

// Response 200
{
  "id": 42,
  "url": "http://paypal-secure-login.verify-account.tk/update?id=123",
  "threatLevel": "PHISHING",
  "threatScore": 88,
  "riskPercentage": "88%",
  "flags": [
    "⚠ No HTTPS — connection is not encrypted",
    "⚠ Suspicious keyword found: \"paypal\"",
    "⚠ Suspicious keyword found: \"secure\"",
    "⚠ Suspicious keyword found: \"login\"",
    "🔴 Suspicious TLD detected: \".tk\"",
    "⚠ Unusually long URL (67 characters)",
    "🔴 Domain mismatch — trusted brand name in subdomain"
  ],
  "scannedAt": "2024-12-15T10:30:00",
  "hasHttps": false,
  "hasSuspiciousKeywords": true,
  "isIpBased": false,
  "isLongUrl": true,
  "hasDomainMismatch": true
}
```

#### GET `/api/scan/history`
```json
// Response 200 — array of scan results (most recent first)
[
  {
    "id": 42,
    "url": "http://paypal-secure.tk/login",
    "threatLevel": "PHISHING",
    "threatScore": 88,
    "riskPercentage": "88%",
    "flags": ["..."],
    "scannedAt": "2024-12-15T10:30:00"
  },
  {
    "id": 41,
    "url": "https://www.google.com",
    "threatLevel": "SAFE",
    "threatScore": 0,
    "riskPercentage": "0%",
    "flags": ["✅ No threats detected — URL appears legitimate"],
    "scannedAt": "2024-12-15T10:28:00"
  }
]
```

#### GET `/api/scan/stats`
```json
// Response 200
{
  "totalScans": 42,
  "safeLinks": 30,
  "suspiciousLinks": 5,
  "phishingDetected": 7
}
```

#### GET `/api/user/profile`
```json
// Response 200
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-12-01T09:00:00",
  "lastLogin": "2024-12-15T10:25:00",
  "totalScans": 42
}
```

---

## 🛡️ Threat Detection Engine

The `UrlAnalysisService` runs 9 parallel heuristic checks:

| Check                  | Score Added | Description                                      |
|------------------------|-------------|--------------------------------------------------|
| No HTTPS               | +20         | URL uses plain HTTP                              |
| IP-based URL           | +30         | URL contains raw IP instead of domain            |
| Long URL (>75 chars)   | +10         | Unusually long URLs often hide malicious paths   |
| Suspicious keywords    | +8 each     | Checks for 30+ phishing-related words            |
| Suspicious TLD         | +15         | `.tk`, `.xyz`, `.ml` and 10 more flagged TLDs    |
| @ symbol in URL        | +25         | Redirect obfuscation trick                       |
| Hex encoding           | +12         | URL percent-encoding used to hide content        |
| Excessive subdomains   | +15         | 3+ dots in hostname = subdomain abuse            |
| Domain mismatch        | +25         | Trusted brand appears as subdomain of other host |

**Scoring thresholds:**
- **0–30** → `SAFE` (green)
- **31–65** → `SUSPICIOUS` (orange)
- **66–100** → `PHISHING` (red)

---

## 🔑 Key Technologies

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, React Router 6, Axios |
| Styling    | Pure CSS (no framework)       |
| Backend    | Spring Boot 3.2, Java 17      |
| Auth       | JWT (jjwt 0.11.5), BCrypt     |
| Database   | MySQL 8 + Spring Data JPA     |
| Security   | Spring Security 6             |

---

## 🚀 Production Deployment Notes

1. **Change JWT secret** to a cryptographically random 256-bit key
2. Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
3. Use HTTPS for both frontend and backend
4. Set `REACT_APP_API_URL` env variable to your production backend URL
5. Enable rate limiting on `/api/scan/url` to prevent abuse
6. Consider adding Redis for scan result caching

---

## 📄 License

MIT License — free for personal and commercial use.
