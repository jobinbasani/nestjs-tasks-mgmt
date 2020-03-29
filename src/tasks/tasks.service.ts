import { TaskRepository } from './task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
        ){

    }

    async getTaskById(id: number): Promise<Task>{
        const task = await this.taskRepository.findOne(id);
        if(!task){
            throw new NotFoundException();
        }
        return task;
    }
    

    /* getAllTasks(): Task[]{
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

    

    deleteTaskById(id: string):void {
        const task = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== task.id);
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
    } */
}
