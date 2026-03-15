# Auth Module

## Purpose
This module manages authentication for members, including login, access-token protected profile access, and refresh-token rotation via persisted sessions.

---

## Business Logic & Rules

### Domain Dictionary
* **Access Token** - Short-lived JWT used to access protected API endpoints
* **Refresh Token** - Longer-lived JWT used only to obtain a new access token
* **Session** - Persisted server-side record that binds a refresh token to a member and expiry window
* **UserData** - Authenticated member identity projected from validated tokens/credentials

### Business Rules
1. **Global JWT Protection:** The module registers JWT auth as an application-level guard. Endpoints must explicitly opt out when using local or refresh strategies.
2. **Credential-Based Login:** Login succeeds only if email exists and password matches the stored member hash.
3. **Session-Backed Refresh:** Each login creates a DB session and issues a refresh token whose `sub` is the session ID.
4. **Refresh Token Rotation:** Refresh deletes the current session and creates a new one, invalidating the old refresh token.
5. **Session Expiration Enforcement:** Refresh requests are rejected when the session is missing or expired.

### Core Operations
* **Login** - Validate credentials and issue access + refresh tokens
* **Get Profile** - Return authenticated member identity from access token
* **Refresh Tokens** - Validate refresh token and rotate session/tokens
* **Logout** - Revoke current refresh session to terminate token rotation

---

## API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | Authenticate member and issue token pair | `LoginDto` |
| GET | `/api/auth/profile` | Return current authenticated user | - |
| POST | `/api/auth/refresh` | Rotate refresh session and issue new token pair | - |
| POST | `/api/auth/logout` | Revoke current refresh session | - |

### Validation Rules

**LoginDto:**
- `email`: Required, valid email format
- `password`: Required, non-empty string

### Authentication Notes

- `POST /api/auth/login` uses local strategy (`email` + `password`) and returns `LoginResponseDto`.
- `GET /api/auth/profile` requires a valid access token in `Authorization: Bearer <token>`.
- `POST /api/auth/refresh` requires a valid refresh token in `Authorization: Bearer <token>`.
- `POST /api/auth/logout` requires a valid refresh token and revokes the underlying session.

---

## Workflow Diagrams

### Login Flow

```mermaid
sequenceDiagram
	participant Client
	participant Controller
	participant LocalStrategy
	participant AuthService
	participant MembersService
	participant SessionsDB

	Client->>Controller: POST /api/auth/login (email, password)
	Controller->>LocalStrategy: validate credentials
	LocalStrategy->>AuthService: validateUser(email, password)
	AuthService->>MembersService: findByEmail(email)

	alt Invalid credentials
		LocalStrategy-->>Client: 401 Unauthorized
	else Valid credentials
		AuthService->>SessionsDB: create session (expires in 7 days)
		AuthService-->>Controller: accessToken + refreshToken
		Controller-->>Client: 200 OK (LoginResponseDto)
	end
```

### Profile Access Flow

```mermaid
sequenceDiagram
	participant Client
	participant JwtGuard
	participant JwtStrategy
	participant Controller

	Client->>JwtGuard: GET /api/auth/profile with access token
	JwtGuard->>JwtStrategy: validate JWT signature/expiry

	alt Invalid or missing token
		JwtGuard-->>Client: 401 Unauthorized
	else Valid token
		JwtStrategy-->>Controller: UserData from payload
		Controller-->>Client: 200 OK (id, email, name)
	end
```

### Refresh Flow (Token Rotation)

```mermaid
sequenceDiagram
	participant Client
	participant RefreshGuard
	participant RefreshStrategy
	participant AuthService
	participant SessionsDB
	participant Controller

	Client->>RefreshGuard: POST /api/auth/refresh with refresh token
	RefreshGuard->>RefreshStrategy: validate refresh JWT
	RefreshStrategy->>AuthService: getSessionById(sessionId from token.sub)

	alt Session missing or expired
		RefreshStrategy-->>Client: 401 Unauthorized
	else Session valid
		RefreshStrategy-->>Controller: UserData + sessionId
		Controller->>AuthService: issueNewAccessToken(user)
		AuthService->>SessionsDB: delete old session
		AuthService->>SessionsDB: create new session
		AuthService-->>Controller: new accessToken + refreshToken
		Controller-->>Client: 200 OK (rotated token pair)
	end
```

### Logout Flow

```mermaid
sequenceDiagram
	participant Client
	participant LogoutGuard
	participant RefreshStrategy
	participant AuthService
	participant SessionsDB
	participant Controller

	Client->>LogoutGuard: POST /api/auth/logout with refresh token
	LogoutGuard->>RefreshStrategy: validate refresh JWT
	RefreshStrategy->>AuthService: getSessionById(sessionId from token.sub)

	alt Session missing or expired
		RefreshStrategy-->>Client: 401 Unauthorized
	else Session valid
		RefreshStrategy-->>Controller: UserData + sessionId
		Controller->>AuthService: logout(user)
		AuthService->>SessionsDB: delete session
		Controller-->>Client: 200 OK
	end
```

---

## Open Questions & Future Considerations

1. **Refresh Reuse Detection:** Should we add telemetry/audit when an already-rotated refresh token is reused (possible token theft signal)?
2. **Session Metadata:** Should sessions store IP/device/user-agent for security monitoring and selective revocation?
3. **Global Logout:** Should we add "logout all devices" to revoke all active sessions for the member?
4. **Session Cleanup:** Should expired sessions be removed via scheduled cleanup job?
