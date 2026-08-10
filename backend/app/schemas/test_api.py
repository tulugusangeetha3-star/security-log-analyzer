import requests

BASE_URL = "http://127.0.0.1:8000"


def test_endpoint(endpoint, name):
    url = BASE_URL + endpoint

    try:
        response = requests.get(url, timeout=5)

        print(f"\n{name}")
        print("-" * 40)
        print(f"URL: {url}")
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            print("✅ PASSED")
            print("Response:")
            print(response.json())
            return True
        else:
            print("❌ FAILED")
            print(response.text)
            return False

    except requests.exceptions.RequestException as e:
        print("❌ CONNECTION FAILED")
        print(e)
        return False


def main():
    print("=" * 50)
    print("SECURITY LOG ANALYZER - API TESTING")
    print("=" * 50)

    results = []

    # Test 1
    results.append(
        test_endpoint(
            "/",
            "Test 1 - Backend Health"
        )
    )

    # Test 2
    results.append(
        test_endpoint(
            "/logs",
            "Test 2 - Logs API"
        )
    )

    # Test 3
    results.append(
        test_endpoint(
            "/analytics",
            "Test 3 - Analytics API"
        )
    )

    # Test 4
    results.append(
        test_endpoint(
            "/incidents",
            "Test 4 - Incidents API"
        )
    )

    # Test 5
    results.append(
        test_endpoint(
            "/reports",
            "Test 5 - Reports API"
        )
    )

    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)

    passed = sum(results)
    total = len(results)

    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")

    if passed == total:
        print("\n🎉 ALL API TESTS PASSED!")
    else:
        print("\n⚠️ Some API tests failed.")


if __name__ == "__main__":
    main()