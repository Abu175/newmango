const http = require('http');
const { AuthService } = require('./src/lib/auth.ts');

// Test the authentication service directly
async function testAuthService() {
  console.log('🧪 Testing AuthService...');

  try {
    // Test user registration
    console.log('\n📝 Testing user registration...');
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
    } catch (error) {
      console.log('✅ Invalid password correctly rejected:', error.message);
    }

    // Test duplicate registration
    console.log('\n🚫 Testing duplicate registration...');
    try {
      await AuthService.register('test@example.com', 'newpassword', 'Another User');
    } catch (error) {
      console.log('✅ Duplicate email correctly rejected:', error.message);
    }

    console.log('\n🎉 All AuthService tests passed!');

  } catch (error) {
    console.error('❌ AuthService test failed:', error);
  }
}

// Test the API endpoints
async function testAPIEndpoints() {
  console.log('\n🌐 Testing API endpoints...');

  const testData = {
    register: {
      email: 'api-test@example.com',
      password: 'password123',
      name: 'API Test User'
    },
    login: {
      email: 'api-test@example.com',
      password: 'password123'
    }
  };

  // Test registration endpoint
  console.log('\n📝 Testing registration endpoint...');
  try {
    const registerResponse = await makeRequest('/api/auth/register', 'POST', testData.register);
    console.log('✅ Registration endpoint works:', registerResponse.success);
  } catch (error) {
    console.log('❌ Registration endpoint failed:', error.message);
  }

  // Test login endpoint
  console.log('\n🔐 Testing login endpoint...');
  try {
    const loginResponse = await makeRequest('/api/auth/login', 'POST', testData.login);
    console.log('✅ Login endpoint works:', loginResponse.success);
  } catch (error) {
    console.log('❌ Login endpoint failed:', error.message);
  }

  // Test invalid login
  console.log('\n❌ Testing invalid login endpoint...');
  try {
    await makeRequest('/api/auth/login', 'POST', {
      email: 'api-test@example.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log('✅ Invalid login correctly rejected:', error.message);
  }
}

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(response.error || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Codilore Authentication Tests...\n');

  // Test AuthService
  await testAuthService();

  // Test API endpoints (only if server is running)
  console.log('\n🔍 Checking if Next.js server is running...');
  try {
    await makeRequest('/api/health', 'GET');
    await testAPIEndpoints();
  } catch (error) {
    console.log('⚠️  Next.js server not running, skipping API endpoint tests');
    console.log('💡 To test API endpoints, run: npm run dev');
  }

  console.log('\n✨ Authentication testing completed!');
}

// Export for use in other files
module.exports = { testAuthService, testAPIEndpoints, runTests };

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}