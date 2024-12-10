from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

# Security configuration
SECRET_KEY = "your-secret-key-here"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./tests.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    test_cases = relationship("TestCaseDB", back_populates="owner")


# SQLAlchemy Model
class TestCaseDB(Base):
    __tablename__ = "test_cases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("UserDB", back_populates="test_cases")


# Create tables
Base.metadata.create_all(bind=engine)


# Pydantic Models
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class TestCaseBase(BaseModel):
    title: str
    description: str
    status: str


class TestCaseCreate(TestCaseBase):
    pass


class TestCaseResponse(TestCaseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    owner_id: int

    class Config:
        from_attributes = True


# FastAPI app
app = FastAPI(title="Test Management API")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Security Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# User Functions
def get_user_by_username(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Authentication Endpoints
@app.post("/login", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/signup", response_model=User)
def register_user(
        user: UserCreate, db: Session = Depends(get_db)
):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    return create_user(db=db, user=user)


@app.get("/users/me/", response_model=User)
async def read_users_me(
        current_user: UserDB = Depends(get_current_user)
):
    return current_user


# Test Cases endpoints
@app.post("/test-cases/", response_model=TestCaseResponse)
def create_test_case(
        test_case: TestCaseCreate, db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user)
):
    db_test_case = TestCaseDB(
        **test_case.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case


@app.get("/test-cases/", response_model=List[TestCaseResponse])
def read_test_cases(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user)
):
    test_cases = db.query(TestCaseDB).filter(
        TestCaseDB.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return test_cases


@app.get("/test-cases/{test_case_id}", response_model=TestCaseResponse)
def read_test_case(
        test_case_id: int,
        db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user)
):
    test_case = db.query(TestCaseDB).filter(
        TestCaseDB.id == test_case_id,
        TestCaseDB.owner_id == current_user.id
    ).first()
    if test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")
    return test_case


@app.put("/test-cases/{test_case_id}", response_model=TestCaseResponse)
def update_test_case(
        test_case_id: int,
        test_case: TestCaseCreate,
        db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user)
):
    db_test_case = db.query(TestCaseDB).filter(
        TestCaseDB.id == test_case_id,
        TestCaseDB.owner_id == current_user.id
    ).first()
    if db_test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")

    for key, value in test_case.dict().items():
        setattr(db_test_case, key, value)

    db.commit()
    db.refresh(db_test_case)
    return db_test_case


@app.delete("/test-cases/{test_case_id}")
def delete_test_case(
        test_case_id: int,
        db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user)
):
    db_test_case = db.query(TestCaseDB).filter(
        TestCaseDB.id == test_case_id,
        TestCaseDB.owner_id == current_user.id
    ).first()
    if db_test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")

    db.delete(db_test_case)
    db.commit()
    return {"message": "Test case deleted"}
