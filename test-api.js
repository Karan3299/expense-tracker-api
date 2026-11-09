async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  const testEmail = `test${Date.now()}@university.com`;
  const testPassword = 'securepassword123';

  console.log('--- Starting API Tests ---\n');

  try {
    // 1. Test Registration
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Student Test', email: testEmail, password: testPassword })
    });
    console.log('1. Register User:', await regRes.json());

    // 2. Test Login & JWT Generation
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    console.log('2. Login:', loginData.token ? 'Success! JWT Token received.' : 'Failed');
    
    const token = loginData.token;

    // 3. Test Protected Route (Create Expense)
    const expRes = await fetch(`${baseUrl}/expenses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: 850, category: 'Food', description: 'Lunch with lab partners' })
    });
    console.log('3. Create Expense:', await expRes.json());

    // 4. Test Protected Route (Fetch Expenses with Populated User Data)
    const getRes = await fetch(`${baseUrl}/expenses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('4. Fetch Expenses (Verify Populate):', await getRes.json());
    
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

runTests();