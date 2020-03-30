import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-tasks.dto';

import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async  createTask(createTaskDto:CreateTaskDto): Promise<Task>{
        const { title, descr} = createTaskDto;

        const task = new Task();
        task.descr = descr;
        task.title = title;
        task.status = TaskStatus.OPEN;
        await this.save(task);
        return task;
    }

    async getTasks(filterDto:GetTasksFilterDto): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

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