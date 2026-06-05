# EduPerform Security Inspection Report

**Date:** June 3, 2026
**Target:** EduPerform Full-Stack Application (React, Express, MySQL, Python Flask)

## 1. Executive Summary
A comprehensive security inspection was conducted on the EduPerform application. The application demonstrates good fundamental security practices, such as preventing SQL injection via parameterized queries and utilizing bcrypt for password hashing. However, several vulnerabilities and misconfigurations were identified, particularly regarding token revocation, missing rate limiting, and unauthenticated internal services.

## 2. Security Strengths
*   **SQL Injection Prevention:** The Express backend consistently uses `mysql2/promise` with parameterized queries (e.g., `[email]`, `[firstName, lastName]`). No raw SQL interpolation was found, making the application highly resistant to SQL Injection.
*   **Password Hashing:** Passwords are securely hashed using `bcryptjs` with a sufficient salt round (10) before being stored in the database.
*   **Input Validation:** The backend uses `express-validator` to strictly type-check and validate incoming request bodies (ranges, data types), mitigating malformed data injection.

## 3. Vulnerabilities & Findings

### High Severity
*   **Token Revocation / Account Deletion Flaw**
    *   *Description:* When an account is soft-deleted, `deleted_at` is populated. However, `authMiddleware.js` only verifies the JWT signature and expiration. It does not check if the account is currently active.
    *   *Impact:* A deleted user whose JWT hasn't expired (up to 7 days) can still access protected routes (e.g., `/api/user/profile`, `/api/predict`).
    *   *Recommendation:* Modify `authMiddleware.js` to query the database and verify `deleted_at IS NULL`, or implement a token blocklist.

### Medium Severity
*   **JWT Stored in LocalStorage**
    *   *Description:* The React client stores the JWT in `localStorage` (`authService.js`).
    *   *Impact:* `localStorage` is accessible via JavaScript, making the token highly susceptible to Cross-Site Scripting (XSS) attacks. If an attacker injects a malicious script, they can steal the token.
    *   *Recommendation:* Move token storage to `HttpOnly`, `Secure`, `SameSite` cookies to mitigate XSS risks.
*   **No Rate Limiting or Brute Force Protection**
    *   *Description:* The authentication routes (`/api/auth/login`, `/api/auth/register`) do not implement rate limiting.
    *   *Impact:* Attackers can perform brute-force attacks to guess passwords or overwhelm the server with registration requests (DoS).
    *   *Recommendation:* Install and configure `express-rate-limit` on the backend, especially for the `/api/auth` routes.
*   **Missing Security Headers (Helmet)**
    *   *Description:* The Express application does not use `helmet` or set HTTP security headers.
    *   *Impact:* The application is missing baseline protections against Clickjacking, MIME-sniffing, and lacks HSTS (HTTP Strict Transport Security).
    *   *Recommendation:* Integrate the `helmet` middleware in `app.js`.

### Low Severity / Best Practices
*   **Unauthenticated Internal ML Service**
    *   *Description:* The Python Flask ML service (`app.py`) exposes `/predict` without any authentication and binds to `0.0.0.0`.
    *   *Impact:* If the internal network is compromised or if the port is accidentally exposed, attackers can hit the ML prediction endpoint directly, potentially exhausting resources.
    *   *Recommendation:* Bind the ML service to `127.0.0.1` (localhost) or implement a shared secret/API key between Express and Flask.
*   **Deserialization Risk with `joblib.load()`**
    *   *Description:* `predict.py` uses `joblib.load()` to load the `.joblib` model files.
    *   *Impact:* `joblib` uses `pickle` under the hood, which is vulnerable to arbitrary code execution if a `.joblib` file is maliciously altered.
    *   *Recommendation:* Ensure the `models/` directory has strict write permissions. 
*   **Information Leakage in Error Handling**
    *   *Description:* The Express error handler (`app.js`) passes `err.message` directly to the client on 500 errors.
    *   *Impact:* Can potentially leak internal database structures, API failures, or stack traces to users.
    *   *Recommendation:* Mask internal error details in production and return generic "Internal Server Error" messages.
*   **Environment Variables Committed to Version Control**
    *   *Description:* The `.env` file containing sensitive variables like `JWT_SECRET` is present in the workspace. If this is tracked by git, it is a severe leak.
    *   *Recommendation:* Ensure `.env` is in `.gitignore` and only commit `.env.example`. Regenerate the `JWT_SECRET` for production.

## 4. Conclusion
The application demonstrates a solid foundation but requires remediation for several standard web vulnerabilities before production deployment. Prioritizing the Token Revocation flaw and implementing Rate Limiting are the most critical immediate next steps.
