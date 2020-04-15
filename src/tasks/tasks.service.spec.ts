import { NotFoundException, Delete } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import {Test} from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

const mockUser = {id:100, username: 'TestUser'};

const mockTaskRepository = () => ( {
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TaskService', ()=>{
    let tasksService;
    let tasksRepository;
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                TasksService,
                {
                    provide: TaskRepository,
                    useFactory: mockTaskRepository
                }
            ]
        }).compile();
        tasksService = await module.get<TasksService>(TasksService);
        tasksRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from repository', async ()=>{
            tasksRepository.getTasks.mockResolvedValue('someValue');
            
            const filters:GetTasksFilterDto = {status: TaskStatus.IN_PROGRESS, search:'Query'};

            expect(tasksRepository.getTasks).not.toHaveBeenCalled();
            const result = await tasksService.getTasks(filters,mockUser);
            expect(tasksRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls  findOne and returns successfully', async () => {
            const mockTask = {title:'Test Task', descr: 'Test desc'};
            tasksRepository.findOne.mockResolvedValue(mockTask);
            const result  = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);
            expect(tasksRepository.findOne).toHaveBeenCalledWith({where:{id:1, userId:mockUser.id}})

        });
        it('throws an error for invalid task', () => {
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', ()=>{
        it('create new task', async () =>{
            expect(tasksRepository.createTask).not.toHaveBeenCalled();
            const mockTask = {title:'NewTask', descr:'NewDescr'};
            tasksRepository.createTask.mockResolvedValue('ReturnValue');
            const result = await tasksService.createTask(mockTask, mockUser);
            expect(tasksRepository.createTask).toHaveBeenCalled();
            expect(result).toEqual('ReturnValue');
            expect(tasksRepository.createTask).toHaveBeenCalledWith(mockTask,mockUser);
        });
    });

    describe('deleteTaskById', () => {
        it('delete existing task', async () => {
            tasksRepository.delete.mockResolvedValue({affected: 1});
            expect(tasksRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(1,mockUser);
            expect(tasksRepository.delete).toHaveBeenCalledWith({id:1, userId:mockUser.id});
        });
        it('throws an exception when deleting', () => {
            tasksRepository.delete.mockResolvedValue({affected: 0});
            expect(tasksService.deleteTaskById(1,mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', ()=>{
        it('update task status', async ()=>{
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1,TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});