// Simple test to verify all endpoints work
const BASE_URL = process.env.API_URL || 'http://localhost:3000';

const testEndpoints = async () => {
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${BASE_URL}/health`);
    console.log('Health:', await healthResponse.json());
    
    // Test login with test accounts
    const testAccounts = [
      'admin@acme.test',
      'user@acme.test', 
      'admin@globex.test',
      'user@globex.test'
    ];
    
    for (let email of testAccounts) {
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password' })
      });
      
      const result = await loginResponse.json();
      console.log(`${email}:`, result.user ? 'SUCCESS' : 'FAILED');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testEndpoints();
