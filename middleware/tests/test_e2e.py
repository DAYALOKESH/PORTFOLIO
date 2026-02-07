"""
End-to-End Integration Tests
Tests the full API integration between frontend and backend.
"""
import requests
from typing import Optional

# Configuration
BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"


class APIClient:
    """Simple API client for testing."""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token: Optional[str] = None
    
    def _url(self, path: str) -> str:
        return f"{self.base_url}{API_PREFIX}{path}"
    
    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def login(self, email: str, password: str) -> bool:
        """Login and store token."""
        response = requests.post(
            f"{self.base_url}{API_PREFIX}/auth/login",
            data={"username": email, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            return True
        return False
    
    def get(self, path: str) -> requests.Response:
        return requests.get(self._url(path), headers=self._headers())
    
    def post(self, path: str, data: dict) -> requests.Response:
        return requests.post(self._url(path), json=data, headers=self._headers())
    
    def put(self, path: str, data: dict) -> requests.Response:
        return requests.put(self._url(path), json=data, headers=self._headers())
    
    def delete(self, path: str) -> requests.Response:
        return requests.delete(self._url(path), headers=self._headers())


def test_health():
    """Test health endpoint."""
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    print("✅ Health check passed")


def test_public_endpoints():
    """Test public API endpoints."""
    client = APIClient()
    
    # Test posts list
    response = client.get("/posts")
    assert response.status_code == 200
    print("✅ GET /posts passed")
    
    # Test projects list
    response = client.get("/projects")
    assert response.status_code == 200
    print("✅ GET /projects passed")


def test_authentication():
    """Test authentication flow."""
    client = APIClient()
    
    # Test invalid login
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/auth/login",
        data={"username": "invalid@example.com", "password": "wrong"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401
    print("✅ Invalid login returns 401")
    
    # Test valid login
    success = client.login("admin@portfolio.local", "admin123")
    assert success
    assert client.token is not None
    print("✅ Valid login returns token")


def test_protected_endpoints():
    """Test admin-protected endpoints."""
    # Without auth
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/posts",
        json={"title": "Test"},
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 401
    print("✅ Protected endpoint requires auth")


def run_all_tests():
    """Run all integration tests."""
    print("\n🧪 Running E2E Integration Tests\n")
    
    try:
        test_health()
        test_public_endpoints()
        test_authentication()
        test_protected_endpoints()
        
        print("\n✅ All tests passed!\n")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}\n")
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection failed. Is the backend running?\n")


if __name__ == "__main__":
    run_all_tests()
