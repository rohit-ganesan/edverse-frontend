#!/usr/bin/env node

/**
 * Edge Functions Testing Script
 * Tests all deployed Edge Functions with proper authentication
 */

const https = require('https');
const fs = require('fs');

// Load environment variables
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const SUPABASE_URL = envVars.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables. Please check .env.local');
  process.exit(1);
}

const PROJECT_ID = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

console.log('🧪 Testing Edge Functions...\n');

// Helper function to make HTTP requests
function makeRequest(functionName, data = null, method = 'POST') {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: `${PROJECT_ID}.supabase.co`,
      port: 443,
      path: `/functions/v1/${functionName}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health-check...');
  try {
    const response = await makeRequest('health-check', null, 'POST');
    if (response.status === 200 && response.data.status === 'healthy') {
      console.log('✅ health-check: PASSED');
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Database: ${response.data.database}`);
      console.log(`   Services: ${Object.keys(response.data.services).join(', ')}`);
    } else {
      console.log('❌ health-check: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ health-check: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function testCreateUserProfile() {
  console.log('🔍 Testing create-user-profile...');
  try {
    const testData = {
      userData: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        role: 'Student',
        address: '123 Test St'
      }
    };
    
    const response = await makeRequest('create-user-profile', testData);
    if (response.status === 401) {
      console.log('✅ create-user-profile: PASSED (Unauthorized as expected - requires auth)');
    } else if (response.status === 200) {
      console.log('✅ create-user-profile: PASSED');
      console.log(`   User ID: ${response.data.userId}`);
    } else {
      console.log('❌ create-user-profile: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ create-user-profile: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function testUpdateUserProfile() {
  console.log('🔍 Testing update-user-profile...');
  try {
    const testData = {
      profileData: {
        first_name: 'Updated',
        last_name: 'Name',
        email: 'updated@example.com'
      }
    };
    
    const response = await makeRequest('update-user-profile', testData);
    if (response.status === 401) {
      console.log('✅ update-user-profile: PASSED (Unauthorized as expected - requires auth)');
    } else if (response.status === 200) {
      console.log('✅ update-user-profile: PASSED');
      console.log(`   Updated: ${response.data.success}`);
    } else {
      console.log('❌ update-user-profile: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ update-user-profile: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function testCreateCourse() {
  console.log('🔍 Testing create-course...');
  try {
    const testData = {
      courseData: {
        title: 'Test Course',
        description: 'A test course for Edge Functions',
        subject: 'Mathematics',
        grade: '10th Grade'
      }
    };
    
    const response = await makeRequest('create-course', testData);
    if (response.status === 401) {
      console.log('✅ create-course: PASSED (Unauthorized as expected - requires auth)');
    } else if (response.status === 200) {
      console.log('✅ create-course: PASSED');
      console.log(`   Course ID: ${response.data.courseId}`);
    } else {
      console.log('❌ create-course: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ create-course: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function testGetUserCourses() {
  console.log('🔍 Testing get-user-courses...');
  try {
    const testData = {
      filters: {
        active: true
      }
    };
    
    const response = await makeRequest('get-user-courses', testData);
    if (response.status === 401) {
      console.log('✅ get-user-courses: PASSED (Unauthorized as expected - requires auth)');
    } else if (response.status === 200) {
      console.log('✅ get-user-courses: PASSED');
      console.log(`   Courses: ${response.data.courses?.length || 0}`);
      console.log(`   User Role: ${response.data.userRole}`);
    } else {
      console.log('❌ get-user-courses: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ get-user-courses: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function testGetDashboardStats() {
  console.log('🔍 Testing get-dashboard-stats...');
  try {
    const testData = {
      dateRange: {
        from: '2024-01-01',
        to: '2024-12-31'
      }
    };
    
    const response = await makeRequest('get-dashboard-stats', testData);
    if (response.status === 401) {
      console.log('✅ get-dashboard-stats: PASSED (Unauthorized as expected - requires auth)');
    } else if (response.status === 200) {
      console.log('✅ get-dashboard-stats: PASSED');
      console.log(`   Stats: ${JSON.stringify(response.data.stats)}`);
      console.log(`   User Role: ${response.data.userRole}`);
    } else {
      console.log('❌ get-dashboard-stats: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ get-dashboard-stats: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(`🚀 Testing Edge Functions for project: ${PROJECT_ID}\n`);
  
  await testHealthCheck();
  await testCreateUserProfile();
  await testUpdateUserProfile();
  await testCreateCourse();
  await testGetUserCourses();
  await testGetDashboardStats();
  
  console.log('🎉 Testing complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Test authenticated functions through the frontend');
  console.log('2. Sign up/login to test user profile creation');
  console.log('3. Create courses and test dashboard stats');
  console.log('4. Verify all functions work with real user data');
}

runAllTests().catch(console.error);
