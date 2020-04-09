import { User } from './../auth/user.entity';
import { TaskRepository } from './task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
        ){

    }

    async getTaskById(id: number, user: User): Promise<Task>{
        const task = await this.taskRepository.findOne({where:{id, userId:user.id}});
        if(!task){
            throw new NotFoundException();
        }
        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user:User):Promise<Task>{
        
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User):Promise<void> {
       const result = await this.taskRepository.delete({id,userId:user.id});
        
        if(result.affected === 0){
            throw new NotFoundException();
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User):Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    getTasks(filterDto: GetTasksFilterDto, user:User):Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto,user);
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

     */
}
