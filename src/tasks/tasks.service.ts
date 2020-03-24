import { Task, TaskStatus } from './tasks.model';
import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const {status, search} = filterDto;
        let tasks = this.getAllTasks();
        if(status){
            tasks = tasks.filter(task => task.status === status);
        }
        if(search){
            tasks = tasks.filter(task => task.title.includes(search) || task.descr.includes(search));
        }
        return tasks;
    }

    getTaskById(id: string): Task{
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string):void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus):Task{
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    createTask(createTaskDto: CreateTaskDto):Task{
        const {title, descr} = createTaskDto;
        const task:Task = {
            id: uuidv4(),
            title,
            descr,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        return task;
    }
}
