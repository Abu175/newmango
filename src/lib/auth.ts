import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory user store (in production, this would be a database)
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

// JWT secret (in production, this should be from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  /**
   * Register a new user with secure password hashing
   */
  static async register(email: string, password: string, name: string): Promise<{ email: string; name: string }> {
    // Validate input
    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      throw new Error("User with this email already exists");
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name: name.trim(),
      passwordHash,
      createdAt: new Date(),
    };

    // Store user (in production, save to database)
    users.set(user.email, user);

    return {
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<{ email: string; name: string }> {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user
    const user = users.get(email.toLowerCase());
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return {
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(user: { email: string; name: string }): string {
    return jwt.sign(
      {
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { email: string; name: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      return {
        email: decoded.email as string,
        name: decoded.name as string,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Hash password (utility function for future use)
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash (utility function for future use)
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Get user by email (for future API endpoints)
   */
  static getUserByEmail(email: string): User | undefined {
    return users.get(email.toLowerCase());
  }

  /**
   * Update user password (for future password reset functionality)
   */
  static async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = users.get(email.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await this.hashPassword(newPassword);
    user.passwordHash = passwordHash;
    users.set(user.email, user);
  }
}

// Export types for use in other modules
export type { User };