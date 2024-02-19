import { injectable } from "tsyringe";
import { CreateTask, Task, UpdateTask } from "../interfaces/tasks.interfaces";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";


@injectable()
export class TasksServices {

    async createTask(id : number, data: CreateTask) : Promise<Task> {
        return await prisma.task.create({
            data : {
                ...data,
                userId : id
            }
        }) as Task;
    }

    async getTasks(id : number, category? : string ) : Promise<Task[]> {

        if(category) {
            return await prisma.task.findMany({
                where : {
                    category : {
                        name : {contains : category, mode : "insensitive"},
                        userId : id
                    }
                },
                include : {category : true},
            }) as Task[];
        }

        return await prisma.task.findMany({
            where : {userId : id},
            include : {category : true}
        }) as Task[];
    }

    async getById(userId : number,id : number) : Promise<Task> {

        return await prisma.task.findFirst({
            where: {
                id : id,
                userId : userId
            },
            include : {category : true}
        }) as Task;
    }

    async updateTask(userId : number, id : number, data : UpdateTask) : Promise<Task> {

        return await prisma.task.update({
            where : {
                id : id,
                userId : userId
            },
            data : data,
        }) as Task;
    }

    async deleteTask(userId : number, id : number) : Promise<void> {

        await prisma.task.delete({
            where: {
                id : id,
                userId : userId
            }
        });
    }
}