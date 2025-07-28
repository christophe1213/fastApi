from app.models.Task import Task
from fastapi import Depends
from sqlmodel import Session,select
from typing import List
def createTasks(t:Task,session:Session)->Task:
    session.add(t)
    session.commit()
    session.refresh(t)
    return t

def readsTask(session:Session)->List[Task]:
    tasks=session.exec(select(Task)).all()
    return tasks 

def readTaskById(id:int,session:Session)->Task:
    task=session.get(Task,id)
    return task

def updateTask(id:int,taskUpdate:Task,session:Session)->Task:
    task=session.get(Task,id)
    if not task :
        return None
    for field, value in taskUpdate.model_dump().items() :
        setattr(task,field,value)
        print(value,field)
    session.commit()
    session.refresh(task)
    return task

def deleteTask(id:int,session:Session)->Task:
    task=session.get(Task,id)
    if not task:
        return None
    session.delete(task)
    session.commit()
    return task    