import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){

    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number):Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    /* @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto):Task[]{
        if(Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

   

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string){
        this.tasksService.deleteTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTasks(@Body() createTaskDto: CreateTaskDto):Task{
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus):Task{
        return this.tasksService.updateTaskStatus(id,status);
    } */
}
