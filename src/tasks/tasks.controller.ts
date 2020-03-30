import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){

    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number):Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTasks(@Body() createTaskDto: CreateTaskDto):Promise<Task>{
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id:number): Promise<void>{
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus):Promise<Task>{
        return this.tasksService.updateTaskStatus(id,status);
    }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto):Promise<Task[]>{
        return this.tasksService.getTasks(filterDto);
    }
}
