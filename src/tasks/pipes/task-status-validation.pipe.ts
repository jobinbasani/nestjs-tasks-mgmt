import { TaskStatus } from './../tasks.model';
import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform{

    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status`);
        }
        return value;
    }
    private isStatusValid(status: any){
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}