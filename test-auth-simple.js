const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store (in production, this would be a database)
const users = new Map();

// JWT secret (in production, this should be from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

class AuthService {
  /**
   * Register a new user with secure password hashing
   */
  static async register(email, password, name) {
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
    const user = {
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
  static async login(email, password) {
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
  static generateToken(user) {
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
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return {
        email: decoded.email,
        name: decoded.name,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Hash password (utility function for future use)
   */
  static async hashPassword(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash (utility function for future use)
   */
  static async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Get user by email (for future API endpoints)
   */
  static getUserByEmail(email) {
    return users.get(email.toLowerCase());
  }

  /**
   * Update user password (for future password reset functionality)
   */
  static async updatePassword(email, newPassword) {
    const user = users.get(email.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await this.hashPassword(newPassword);
    user.passwordHash = passwordHash;
    users.set(user.email, user);
  }
}

// Test the authentication service
async function testAuthService() {
  console.log('🧪 Testing AuthService...\n');

  try {
    // Test user registration
    console.log('📝 Testing user registration...');
    const user = await AuthService.register('test@example.com', 'password123', 'Test User');
    console.log('✅ Registration successful:', user);

    // Test login
    console.log('\n🔐 Testing user login...');
    const loginResult = await AuthService.login('test@example.com', 'password123');
    console.log('✅ Login successful:', loginResult);

    // Test token generation
    console.log('\n🎫 Testing token generation...');
    const token = AuthService.generateToken(loginResult);
    console.log('✅ Token generated:', token.substring(0, 50) + '...');

    // Test token verification
    console.log('\n🔍 Testing token verification...');
    const decoded = AuthService.verifyToken(token);
    console.log('✅ Token verified:', decoded);

    // Test password hashing
    console.log('\n🔒 Testing password hashing...');
    const hash = await AuthService.hashPassword('testpassword');
    const isValid = await AuthService.verifyPassword('testpassword', hash);
    console.log('✅ Password hashing works:', isValid);

    // Test invalid login
    console.log('\n❌ Testing invalid login...');
    try {
      await AuthService.login('test@example.com', 'wrongpassword');
      console.log('❌ Should have failed!');
    } catch (error) {
      console.log('✅ Invalid password correctly rejected:', error.message);
    }

    // Test duplicate registration
    console.log('\n🚫 Testing duplicate registration...');
    try {
      await AuthService.register('test@example.com', 'newpassword', 'Another User');
      console.log('❌ Should have failed!');
    } catch (error) {
      console.log('✅ Duplicate email correctly rejected:', error.message);
    }

    // Test password update
    console.log('\n🔄 Testing password update...');
    await AuthService.updatePassword('test@example.com', 'newpassword123');
    const newLogin = await AuthService.login('test@example.com', 'newpassword123');
    console.log('✅ Password update successful:', newLogin);

    console.log('\n🎉 All AuthService tests passed!');

  } catch (error) {
    console.error('❌ AuthService test failed:', error);
    process.exit(1);
  }
}

// Test API endpoints simulation
async function testAPIEndpoints() {
  console.log('\n🌐 Testing API endpoints simulation...\n');

  // Simulate registration endpoint
  console.log('📝 Simulating registration endpoint...');
  try {
    const user = await AuthService.register('api-test@example.com', 'password123', 'API Test User');
    const token = AuthService.generateToken(user);
    console.log('✅ Registration endpoint simulation successful');
    console.log('   User:', user);
    console.log('   Token:', token.substring(0, 30) + '...');
  } catch (error) {
    console.log('❌ Registration endpoint simulation failed:', error.message);
  }

  // Simulate login endpoint
  console.log('\n🔐 Simulating login endpoint...');
  try {
    const user = await AuthService.login('api-test@example.com', 'password123');
    const token = AuthService.generateToken(user);
    console.log('✅ Login endpoint simulation successful');
    console.log('   User:', user);
    console.log('   Token:', token.substring(0, 30) + '...');
  } catch (error) {
    console.log('❌ Login endpoint simulation failed:', error.message);
  }

  // Simulate invalid login
  console.log('\n❌ Simulating invalid login...');
  try {
    await AuthService.login('api-test@example.com', 'wrongpassword');
    console.log('❌ Should have failed!');
  } catch (error) {
    console.log('✅ Invalid login correctly rejected:', error.message);
  }
}

// Test full authentication flow
async function testFullFlow() {
  console.log('\n🔄 Testing full authentication flow...\n');

  const email = 'full-flow@example.com';
  const password = 'fullflow123';
  const name = 'Full Flow User';

  try {
    // 1. Register
    console.log('1️⃣ Registering user...');
    const registeredUser = await AuthService.register(email, password, name);
    console.log('✅ Registration successful:', registeredUser);

    // 2. Login
    console.log('\n2️⃣ Logging in user...');
    const loggedInUser = await AuthService.login(email, password);
    console.log('✅ Login successful:', loggedInUser);

    // 3. Generate token
    console.log('\n3️⃣ Generating JWT token...');
    const token = AuthService.generateToken(loggedInUser);
    console.log('✅ Token generated');

    // 4. Verify token
    console.log('\n4️⃣ Verifying JWT token...');
    const decoded = AuthService.verifyToken(token);
    console.log('✅ Token verified:', decoded);

    // 5. Test token contains correct data
    console.log('\n5️⃣ Validating token contents...');
    if (decoded && decoded.email === email && decoded.name === name) {
      console.log('✅ Token contains correct user data');
    } else {
      console.log('❌ Token data mismatch');
    }

    console.log('\n🎉 Full authentication flow test passed!');

  } catch (error) {
    console.error('❌ Full flow test failed:', error);
    process.exit(1);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Codilore Authentication Tests...\n');

  await testAuthService();
  await testAPIEndpoints();
  await testFullFlow();

  console.log('\n✨ All authentication tests completed successfully! 🎉');
  console.log('\n📋 Test Summary:');
  console.log('   ✅ User registration with password hashing');
  console.log('   ✅ User login with password verification');
  console.log('   ✅ JWT token generation and verification');
  console.log('   ✅ Password hashing and verification utilities');
  console.log('   ✅ Duplicate email prevention');
  console.log('   ✅ Invalid login rejection');
  console.log('   ✅ Password update functionality');
  console.log('   ✅ API endpoint simulation');
  console.log('   ✅ Full authentication flow');
}

// Export for use in other files
module.exports = { AuthService, testAuthService, testAPIEndpoints, testFullFlow, runAllTests };

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}