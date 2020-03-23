import { Task } from './tasks.model';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){

    }

    @Get()
    getAllTasks():Task[]{
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTasks(@Body('title') title, @Body('descr') descr):Task{
        return this.tasksService.createTask(title,descr);
    }
}
