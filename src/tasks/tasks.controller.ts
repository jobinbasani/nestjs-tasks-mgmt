import { CreateTaskDto } from './dto/create-tasks.dto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){

    }

    @Get()
    getAllTasks():Task[]{
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string):Task{
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string){
        this.tasksService.deleteTaskById(id);
    }

    @Post()
    createTasks(@Body() createTaskDto: CreateTaskDto):Task{
        return this.tasksService.createTask(createTaskDto);
    }
}
