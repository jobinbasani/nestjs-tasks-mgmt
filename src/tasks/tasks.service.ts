import { Task, TaskStatus } from './tasks.model';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
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
            id: uuid(),
            title,
            descr,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        return task;
    }
}
