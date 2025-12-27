import asyncio
import asyncpg
from app.core.config import settings

async def check_db():
    print(f"Connecting to {settings.DATABASE_URL}...")
    try:
        conn = await asyncpg.connect(settings.DATABASE_URL)
        print("Successfully connected to the database!")
        await conn.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())
