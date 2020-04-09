import { User } from './../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-tasks.dto';

import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from './task-status.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    private logger = new Logger('TaskRepository');

    async  createTask(createTaskDto:CreateTaskDto, user:User): Promise<Task>{
        const { title, descr} = createTaskDto;

        const task = new Task();
        task.descr = descr;
        task.title = title;
        task.status = TaskStatus.OPEN;
        task.user = user;
        try{
            await this.save(task);
        }catch(error){
            this.logger.error(`Failed to craete a task for ${user.username}. Data: ${JSON.stringify(createTaskDto)}`, error.stack);
        }
        delete task.user;
        return task;
    }

    async getTasks(filterDto:GetTasksFilterDto, user:User): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId',{userId:user.id});

        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('task.title LIKE :search OR task.descr LIKE :search',{search:`%${search}%`});
        }
        const tasks = await query.getMany();
        return tasks;
    }
}