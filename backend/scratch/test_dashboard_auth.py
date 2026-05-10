import asyncio
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        # 0. Register
        reg_data = {
            "email": "test401@example.com",
            "password": "Password123!",
            "first_name": "Test",
            "last_name": "User",
            "role": "jobseeker",
            "auth_method": "email"
        }
        res = await client.post("http://127.0.0.1:8000/api/auth/register", json=reg_data)
        print("Register:", res.status_code, res.text)
        
        # 1. Login
        response = await client.post("http://127.0.0.1:8000/api/auth/login", data={"username": "test401@example.com", "password": "Password123!"})
        print("Login:", response.status_code, response.text)
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data:
                token = data["data"]["access_token"]
            else:
                token = data["access_token"]
            
            # 2. Access dashboard
            dash_resp = await client.get("http://127.0.0.1:8000/api/dashboard", headers={"Authorization": f"Bearer {token}"})
            print("Dashboard:", dash_resp.status_code, dash_resp.text)

if __name__ == "__main__":
    asyncio.run(main())
