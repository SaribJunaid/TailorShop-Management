from passlib.context import CryptContext

# Use Argon2 instead of bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:128])


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)
