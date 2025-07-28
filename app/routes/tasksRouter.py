from fastapi import APIRouter,Depends,HTTPException
from typing import List
from app.services import TasksService
from app.models.Task import Task
from sqlmodel import Session
from app.databases import databases
router=APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/",response_model=Task)
def post(t:Task,session:Session=Depends(databases.get_session))->Task:
    return TasksService.createTasks(t,session)

@router.get("/")
def get(session:Session=Depends(databases.get_session))->List[Task]:
    return TasksService.readsTask(session)

@router.get("/{id}",response_model=Task)
def readTaskById(id: int,session:Session=Depends(databases.get_session))->Task:
    res=TasksService.readTaskById(id,session)
    if res ==None: raise HTTPException(status_code=400,detail="task not found")
    return res

@router.put('/{id}',response_model=Task)
def updateTask(id:int,taskUpdate:Task,session:Session=Depends(databases.get_session))->Task:
    res=TasksService.updateTask(id,taskUpdate,session)
    if res ==None: raise HTTPException(status_code=400,detail="task not found")
    return res

@router.delete('/{id}',response_model=Task)
def deleteTask(id:int,session:Session=Depends(databases.get_session))->Task:
    res=TasksService.deleteTask(id,session)
    if res ==None: raise HTTPException(status_code=400,detail="task not found")
    return res




