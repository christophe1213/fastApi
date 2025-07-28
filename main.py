from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tasksRouter
app = FastAPI()
# Liste des origines autorisées
origins = [
    "null",  #POUR LES FICHIERS HTML LOCAUX
    # Ajoutez d'autres origines si nécessaire (par exemple, pour un frontend React, Vue, Angular)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(tasksRouter.router)





