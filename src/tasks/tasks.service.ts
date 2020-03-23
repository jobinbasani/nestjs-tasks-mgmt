import { Task, TaskStatus } from './tasks.model';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v1';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    createTask(title: string, descr: string):Task{
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
