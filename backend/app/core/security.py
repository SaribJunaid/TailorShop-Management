from passlib.context import CryptContext

# Configuration for Argon2 hashing
# passlib handles the salt generation and complexity automatically
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Takes a plain-text password and returns a secure hash.
    Standard practice: truncate long passwords to 128 characters to prevent DoS attacks.
    """
    return pwd_context.hash(password[:128])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compares a plain-text password with a stored hash to see if they match.
    """
    return pwd_context.verify(plain_password, hashed_password)