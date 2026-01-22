import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { AuthService } from "../lib/auth"

// Mock environment variables
process.env.JWT_SECRET = "test-jwt-secret"

describe("Codilore Authentication Integration", () => {
  let server: any
  let baseUrl: string

  beforeAll(async () => {
    // Start Next.js server for integration testing
    const app = next({
      dev: false,
      dir: process.cwd(),
    })

    await app.prepare()

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true)
      app.getRequestHandler()(req, res, parsedUrl)
    })

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address()
        baseUrl = `http://localhost:${(address as any).port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve())
      })
    }
  })

  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      }

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.user).toEqual({
        email: "test@example.com",
        name: "Test User",
      })
      expect(data.token).toBeDefined()
      expect(typeof data.token).toBe("string")
    })

    test("should return error for duplicate email", async () => {
      // First register a user
      await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "duplicate@example.com",
          password: "password123",
          name: "First User",
        }),
      })

      // Try to register again with same email
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "duplicate@example.com",
          password: "password456",
          name: "Second User",
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("User with this email already exists")
    })

    test("should return error for weak password", async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "weak@example.com",
          password: "123", // Too short
          name: "Weak User",
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("Password must be at least 8 characters long")
    })

    test("should return error for missing fields", async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incomplete@example.com",
          // Missing password and name
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("Email, password, and name are required")
    })
  })

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      // Register a test user for login tests
      await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login-test@example.com",
          password: "password123",
          name: "Login Test User",
        }),
      })
    })

    test("should login successfully with correct credentials", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login-test@example.com",
          password: "password123",
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.user).toEqual({
        email: "login-test@example.com",
        name: "Login Test User",
      })
      expect(data.token).toBeDefined()
      expect(typeof data.token).toBe("string")
    })

    test("should return error for invalid email", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe("Invalid email or password")
    })

    test("should return error for wrong password", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login-test@example.com",
          password: "wrongpassword",
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe("Invalid email or password")
    })

    test("should return error for missing fields", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login-test@example.com",
          // Missing password
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("Email and password are required")
    })
  })

  describe("AuthService Integration", () => {
    test("should generate and verify JWT tokens", async () => {
      const user = { email: "jwt-test@example.com", name: "JWT Test User" }

      // Generate token
      const token = AuthService.generateToken(user)
      expect(token).toBeDefined()
      expect(typeof token).toBe("string")

      // Verify token
      const decoded = AuthService.verifyToken(token)
      expect(decoded).toEqual(user)
    })

    test("should return null for invalid tokens", () => {
      const invalidToken = "invalid.jwt.token"
      const decoded = AuthService.verifyToken(invalidToken)
      expect(decoded).toBeNull()
    })

    test("should handle password hashing and verification", async () => {
      const password = "testpassword123"
      const hash = await AuthService.hashPassword(password)
      expect(hash).toBeDefined()
      expect(typeof hash).toBe("string")

      const isValid = await AuthService.verifyPassword(password, hash)
      expect(isValid).toBe(true)

      const isInvalid = await AuthService.verifyPassword("wrongpassword", hash)
      expect(isInvalid).toBe(false)
    })

    test("should handle user registration and retrieval", async () => {
      const email = "service-test@example.com"
      const password = "servicepassword123"
      const name = "Service Test User"

      // Register user
      const registeredUser = await AuthService.register(email, password, name)
      expect(registeredUser).toEqual({ email, name })

      // Retrieve user
      const retrievedUser = AuthService.getUserByEmail(email)
      expect(retrievedUser).toBeDefined()
      expect(retrievedUser!.email).toBe(email)
      expect(retrievedUser!.name).toBe(name)

      // Login user
      const loggedInUser = await AuthService.login(email, password)
      expect(loggedInUser).toEqual({ email, name })
    })

    test("should handle password updates", async () => {
      const email = "update-test@example.com"
      const oldPassword = "oldpassword123"
      const newPassword = "newpassword123"

      // Register user
      await AuthService.register(email, oldPassword, "Update Test User")

      // Update password
      await AuthService.updatePassword(email, newPassword)

      // Verify old password doesn't work
      await expect(AuthService.login(email, oldPassword)).rejects.toThrow("Invalid email or password")

      // Verify new password works
      const loggedInUser = await AuthService.login(email, newPassword)
      expect(loggedInUser.email).toBe(email)
    })
  })

  describe("Authentication Flow Integration", () => {
    test("should complete full authentication flow", async () => {
      const email = "full-flow@example.com"
      const password = "fullflow123"
      const name = "Full Flow User"

      // 1. Register user
      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      expect(registerResponse.status).toBe(200)
      const registerData = await registerResponse.json()
      expect(registerData.success).toBe(true)
      expect(registerData.token).toBeDefined()

      // 2. Login with registered user
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      expect(loginResponse.status).toBe(200)
      const loginData = await loginResponse.json()
      expect(loginData.success).toBe(true)
      expect(loginData.token).toBeDefined()

      // 3. Verify tokens are different (new login generates new token)
      expect(loginData.token).not.toBe(registerData.token)

      // 4. Verify JWT token contains correct user data
      const decodedUser = AuthService.verifyToken(loginData.token)
      expect(decodedUser).toEqual({ email, name })
    })
  })
})