#!/bin/bash

# This script will test the authentication flow of our token-based login system
# It uses curl to make requests to the backend API

# Base URL for the API
API_URL="http://localhost:8000"

# Test user credentials
TEST_USERNAME="testuser"
TEST_EMAIL="test@example.com"
TEST_PASSWORD="Password123!"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting authentication flow tests...${NC}"

# Test 1: Registration
echo -e "\n${BLUE}Test 1: User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST \
  "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${TEST_USERNAME}\",\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")

if [[ $REGISTER_RESPONSE == *"$TEST_EMAIL"* ]]; then
  echo -e "${GREEN}✓ Registration successful${NC}"
  echo "Response: $REGISTER_RESPONSE"
else
  echo -e "${RED}✗ Registration failed${NC}"
  echo "Response: $REGISTER_RESPONSE"
fi

# Test 2: Login
echo -e "\n${BLUE}Test 2: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
  "${API_URL}/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${TEST_EMAIL}&password=${TEST_PASSWORD}")

# Extract token from response
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [[ ! -z "$ACCESS_TOKEN" ]]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Token received: ${ACCESS_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
fi

# Test 3: Access Protected Route
echo -e "\n${BLUE}Test 3: Access Protected Route${NC}"
if [[ ! -z "$ACCESS_TOKEN" ]]; then
  PROFILE_RESPONSE=$(curl -s -X GET \
    "${API_URL}/users/me" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")
  
  if [[ $PROFILE_RESPONSE == *"$TEST_EMAIL"* ]]; then
    echo -e "${GREEN}✓ Protected route access successful${NC}"
    echo "Response: $PROFILE_RESPONSE"
  else
    echo -e "${RED}✗ Protected route access failed${NC}"
    echo "Response: $PROFILE_RESPONSE"
  fi
else
  echo -e "${RED}✗ Skipping protected route test (no token)${NC}"
fi

echo -e "\n${BLUE}Authentication flow tests completed${NC}"
