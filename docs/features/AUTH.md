# Feature Specification: Authentication & User Accounts

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/AUTH.md`](../design/AUTH.md), [`docs/design/PROFILE.md`](../design/PROFILE.md)  
> - 🗄️ Bảng dữ liệu: `users` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#8-streak--xp-rules-ambient-20)  
> - 💻 Frontend Code: `frontend/src/features/auth/`, `frontend/src/layouts/AuthLayout.tsx`  
> - ☕ Backend Service: `com.englishflow.user.service.AuthService`, `com.englishflow.security.JwtTokenProvider`

---

## 1. Overview
Provides secure, stateless JWT authentication and authorization for EnglishFlow, supporting role-based access control (`ROLE_USER`, `ROLE_ADMIN`) and seamless onboarding.

---

## 2. Authentication Capabilities
- **Email / Password Sign-Up & Sign-In:**
  - Password hashing with BCrypt (cost factor 12).
  - Issuance of short-lived JWT Access Token (15 mins) and long-lived Refresh Token (7 days).
- **Google OAuth2 Sign-In:**
  - Google Identity Services renders the official popup button in the browser.
  - The frontend sends only the returned ID token to the backend; the backend verifies its signature, issuer, audience, expiry and verified email before issuing a Flowling JWT.
  - Existing Gmail or Google Workspace identities are linked by verified email and pinned to the immutable Google `sub` claim. New identities receive `ROLE_USER`.
- **Refresh Token Rotation:**
  - Automatic token rotation upon refresh request to prevent replay attacks.
- **User Profile State:**
  - Tracks `current_streak` (`🔥 7 ngày`), `total_xp`, avatar URL, and preferences.

---

## 3. Endpoints
- `POST /api/v1/auth/register`: Register new user account.
- `POST /api/v1/auth/login`: Authenticate and issue token pair.
- `POST /api/v1/auth/google`: Verify a Google ID token and issue a Flowling JWT.
- `POST /api/v1/auth/refresh`: Exchange valid refresh token for new access token.
- `POST /api/v1/auth/logout`: Invalidate refresh token.
- `GET /api/v1/auth/me`: Fetch authenticated user profile, streak, and preferences.

## Google Sign-In configuration — 2026-09-18

Create a Google OAuth 2.0 **Web application** client and add `http://localhost:3000` to Authorized JavaScript origins. For Docker, set the same client ID in `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` in the root `.env`. When running services directly, put `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` and expose `GOOGLE_CLIENT_ID` to Spring Boot through the shell or IDE. Google Sign-In requires the backend because credential validation and account creation happen server-side.

## Frontend demo implementation — 2026-09-10

Email/password demo state remains available for local exploration. Google Sign-In uses the production API contract and does not fall back to a client-side identity.

- Frontend: [`frontend/src/features/auth/`](../../frontend/src/features/auth/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
