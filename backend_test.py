#!/usr/bin/env python3
"""
Backend API Testing Script for EduPulse Application
Tests the following endpoints:
1. Health Check: GET /api/
2. PDF Serving: GET /api/pdfs/cpp_workbook.pdf
3. AI Chat: POST /api/ai/chat
"""

import requests
import json
import sys
from pathlib import Path

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if not frontend_env_path.exists():
        print("❌ Frontend .env file not found")
        return None
    
    with open(frontend_env_path, 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    
    print("❌ REACT_APP_BACKEND_URL not found in frontend .env")
    return None

def test_health_check(base_url):
    """Test the health check endpoint"""
    print("\n🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Health check endpoint working correctly")
                return True
            else:
                print(f"❌ Unexpected response content: {data}")
                return False
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check request failed: {str(e)}")
        return False

def test_pdf_endpoint(base_url):
    """Test the PDF serving endpoint"""
    print("\n🔍 Testing PDF Serving Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/pdfs/cpp_workbook.pdf", timeout=15)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'Not set')}")
        print(f"Content-Length: {response.headers.get('content-length', 'Not set')} bytes")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            
            # Check if content type is correct
            if content_type == 'application/pdf':
                print("✅ PDF content-type is correct")
                
                # Check if response contains PDF content
                content = response.content
                if content.startswith(b'%PDF'):
                    print("✅ PDF file content is valid (starts with %PDF)")
                    print(f"✅ PDF file size: {len(content)} bytes")
                    return True
                else:
                    print("❌ Response does not contain valid PDF content")
                    return False
            else:
                print(f"❌ Incorrect content-type. Expected 'application/pdf', got '{content_type}'")
                return False
        elif response.status_code == 404:
            print("❌ PDF file not found (404)")
            return False
        else:
            print(f"❌ PDF endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ PDF endpoint request failed: {str(e)}")
        return False

def test_ai_chat_endpoint(base_url):
    """Test the AI chat endpoint"""
    print("\n🔍 Testing AI Chat Endpoint...")
    try:
        # Test data
        test_message = {
            "message": "What is C++ programming language?",
            "conversationHistory": []
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f"{base_url}/api/ai/chat", 
            json=test_message,
            headers=headers,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'Not set')}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Response keys: {list(data.keys())}")
                
                if 'response' in data and 'success' in data:
                    if data['success'] and data['response']:
                        print("✅ AI chat endpoint working correctly")
                        print(f"AI Response preview: {data['response'][:100]}...")
                        return True
                    else:
                        print(f"❌ AI chat returned success=False or empty response")
                        print(f"Full response: {data}")
                        return False
                else:
                    print(f"❌ AI chat response missing required fields")
                    print(f"Full response: {data}")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ AI chat response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ AI chat failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI chat request failed: {str(e)}")
        return False

def main():
    """Main testing function"""
    print("🚀 Starting Backend API Tests for EduPulse")
    print("=" * 50)
    
    # Get backend URL
    backend_url = get_backend_url()
    if not backend_url:
        print("❌ Could not determine backend URL")
        sys.exit(1)
    
    print(f"Backend URL: {backend_url}")
    
    # Track test results
    results = {
        'health_check': False,
        'pdf_serving': False,
        'ai_chat': False
    }
    
    # Run tests
    results['health_check'] = test_health_check(backend_url)
    results['pdf_serving'] = test_pdf_endpoint(backend_url)
    results['ai_chat'] = test_ai_chat_endpoint(backend_url)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASS" if passed_test else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)