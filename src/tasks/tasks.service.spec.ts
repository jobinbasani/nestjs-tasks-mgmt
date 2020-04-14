import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import {Test} from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

const mockUser = {id:100, username: 'TestUser'};

const mockTaskRepository = () => ( {
    getTasks: jest.fn(),
    findOne: jest.fn(),
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
});