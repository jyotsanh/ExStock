import requests
import unittest

BASE_URL = "http://localhost:3000"
AUTH_URL = f"{BASE_URL}/auth"
USERS_URL = f"{BASE_URL}/users"
COURSE_URL = f"{BASE_URL}/course"

class TestAuthAPI(unittest.TestCase):
    def setUp(self):
        self.test_email = "testuser@example.com"
        self.test_username = "testuser123"
        self.test_password = "Test@1234"
        self.test_wrong_password = "Wrong@1234"
        
        # Clean up if user exists
        requests.delete(f"{USERS_URL}/cleanup")  # Note: You'd need to implement this endpoint

    def test_signup_and_login_flow(self):
        """Test complete signup -> login -> profile flow"""
        # 1. Test Signup
        signup_payload = {
            "email": self.test_email,
            "username": self.test_username,
            "password": self.test_password,
            "confirmPassword": self.test_password
        }
        signup_res = requests.post(f"{AUTH_URL}/signup", json=signup_payload)
        self.assertEqual(signup_res.status_code, 201)
        signup_data = signup_res.json()
        self.assertIn("token", signup_data)
        
        # 2. Test Login with Email
        login_payload = {
            "emailOrUsername": self.test_email,
            "password": self.test_password
        }
        login_res = requests.post(f"{AUTH_URL}/login", json=login_payload)
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.json()
        token = login_data["token"]
        
        # 3. Test Get Profile
        headers = {"Authorization": f"Bearer {token}"}
        profile_res = requests.get(f"{USERS_URL}/profile", headers=headers)
        self.assertEqual(profile_res.status_code, 200)
        profile_data = profile_res.json()
        self.assertEqual(profile_data["email"], self.test_email)
        self.assertEqual(profile_data["username"], self.test_username)

    def test_invalid_login(self):
        """Test login with wrong credentials"""
        login_payload = {
            "emailOrUsername": "nonexistent@user.com",
            "password": "wrongpassword"
        }
        login_res = requests.post(f"{AUTH_URL}/login", json=login_payload)
        self.assertEqual(login_res.status_code, 401)

# ------------------ COURSE ROUTE TESTS ------------------

class TestCourseAPI(unittest.TestCase):
    def setUp(self):
        self.course_payload = {
            "title": "Test NEPSE Course",
            "level": "beginner",
            "platform": "YouTube",
            "link": "https://youtube.com/testcourse",
            "duration": "2 hours",
            "instructor": "Mr. Tester",
            "tags": ["nepse", "basics", "finance"],
            "introduction": "This is an intro to NEPSE.",
            "description": "Detailed course description.",
            "references": ["https://ref1.com", "https://ref2.com"],
            "quiz": [
                {
                    "question": "What is NEPSE?",
                    "options": ["Stock Market", "Bank", "Insurance"],
                    "answer": "Stock Market"
                }
            ]
        }

    def test_create_and_get_course(self):
        # Create course
        res = requests.post(f"{COURSE_URL}/create", json=self.course_payload)
        self.assertEqual(res.status_code, 201)
        course_data = res.json()
        self.assertEqual(course_data["title"], self.course_payload["title"])
        self.course_id = course_data["_id"]

        # Get course by ID
        res = requests.get(f"{COURSE_URL}/{self.course_id}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["title"], self.course_payload["title"])

    def test_get_all_courses(self):
        res = requests.get(f"{COURSE_URL}/")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)

    def test_get_courses_by_level(self):
        res = requests.get(f"{COURSE_URL}/level/beginner")
        self.assertEqual(res.status_code, 200)
        courses = res.json()
        for course in courses:
            self.assertEqual(course["level"], "beginner")


if __name__ == "__main__":
    unittest.main()