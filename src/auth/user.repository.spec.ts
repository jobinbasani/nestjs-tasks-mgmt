import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword'};

describe('UserRepository',()=>{
    let userRepository;
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                UserRepository,
            ],
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', ()=>{
        let save;
        beforeEach(()=>{
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });
        it('succesfully signs up',()=>{
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('throws  conflict exception', ()=>{
            save.mockRejectedValue({code:'23505'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('unhandled exception', ()=>{
            save.mockRejectedValue({code:'123456'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });
    
    describe('validate user and password', ()=>{

        let user;

        beforeEach(()=>{
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = "TestUsername";
            user.password = "TestPassword";
            user.validatePassword = jest.fn();
        });

        it('returns username as validation is successful', async ()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validateUser(mockCredentialsDto);
            expect(result).toEqual('TestUsername');
        });
        
        it('returns null as user cannot be found', async ()=>{
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUser(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null as password is invalid', async ()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUser(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
    describe('hashPassword',()=>{
        it('calls bcrypt hash to generated password', async ()=>{
            bcrypt.hash = jest.fn().mockResolvedValue('TestHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('TestPassword','TestSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword','TestSalt')
            expect(result).toEqual('TestHash');
        });
    });
});