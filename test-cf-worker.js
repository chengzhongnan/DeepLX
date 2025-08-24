// Test script for Cloudflare Workers deployment
// This script tests the basic functionality of the DeepLX API

async function testAPI() {
  const baseURL = 'http://127.0.0.1:8787'; // Local development URL from wrangler
  
  console.log('Testing DeepLX Cloudflare Workers API...\n');
  
  // Test root endpoint
  console.log('1. Testing root endpoint...');
  try {
    const rootResponse = await fetch(baseURL + '/', {
      method: 'GET'
    });
    const rootData = await rootResponse.json();
    console.log('   Status:', rootResponse.status);
    console.log('   Response:', rootData);
  } catch (error) {
    console.error('   Error:', error);
  }
  
  console.log('\n2. Testing 404 error handling...');
  try {
    const notFoundResponse = await fetch(baseURL + '/nonexistent', {
      method: 'GET'
    });
    const notFoundData = await notFoundResponse.json();
    console.log('   Status:', notFoundResponse.status);
    console.log('   Response:', notFoundData);
  } catch (error) {
    console.error('   Error:', error);
  }
  
  console.log('\n3. Testing translate endpoint (without auth)...');
  try {
    const translateResponse = await fetch(baseURL + '/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      })
    });
    const translateData = await translateResponse.json();
    console.log('   Status:', translateResponse.status);
    console.log('   Response:', translateData);
  } catch (error) {
    console.error('   Error:', error);
  }
  
  console.log('\nAPI test completed.');
}

testAPI();