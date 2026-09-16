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
  - Fast, one-click social authentication.
- **Refresh Token Rotation:**
  - Automatic token rotation upon refresh request to prevent replay attacks.
- **User Profile State:**
  - Tracks `current_streak` (`🔥 7 ngày`), `total_xp`, avatar URL, and preferences.

---

## 3. Endpoints
- `POST /api/v1/auth/register`: Register new user account.
- `POST /api/v1/auth/login`: Authenticate and issue token pair.
- `POST /api/v1/auth/refresh`: Exchange valid refresh token for new access token.
- `POST /api/v1/auth/logout`: Invalidate refresh token.
- `GET /api/v1/auth/me`: Fetch authenticated user profile, streak, and preferences.

## Frontend demo implementation — 2026-09-10

Authentication and profile is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/auth/`](../../frontend/src/features/auth/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
