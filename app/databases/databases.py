from sqlmodel import SQLModel,Session, create_engine
DATABASES_URL="sqlite:///./data.db"
engine=create_engine(DATABASES_URL,echo=True)
SQLModel.metadata.create_all(engine)

def get_session():
    with Session (engine) as session:
        yield session
