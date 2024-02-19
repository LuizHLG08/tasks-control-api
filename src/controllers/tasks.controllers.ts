import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TasksServices } from "../services/tasks.services";

@injectable()
export class TasksControllers {

    constructor(@inject("TasksServices") private tasksServices : TasksServices) {    
    }

    async createTask(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.tasksServices.createTask(userId, req.body);

        return res.status(201).json(response);
    }

    async getTasks(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.tasksServices.getTasks(userId, req.query.category as string);

        return res.status(200).json(response);
    }

    async getById(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.tasksServices.getById(userId, +req.params.id);

        return res.status(200).json(response);
    }

    async updateTask(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.tasksServices.updateTask(userId, +req.params.id, req.body);

        return res.status(200).json(response);
    }

    async deleteTask(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        await this.tasksServices.deleteTask(userId, +req.params.id);

        return res.status(204).json();
    }
}