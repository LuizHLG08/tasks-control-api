import { inject, injectable } from "tsyringe";
import { UsersServices } from "../services/users.services";
import { Request, Response } from "express";

@injectable()
export class UsersControllers {

    constructor(@inject("UsersServices") private usersServices : UsersServices){}

    async register(req : Request, res : Response) : Promise<Response> {
        const response = await this.usersServices.register(req.body)

        return res.status(201).json(response)
    }

    async login(req : Request, res : Response) : Promise<Response> {
        const response = await this.usersServices.login(req.body)

        return res.status(200).json(response)
    }

    async getProfile(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.usersServices.getProfile(userId)

        return res.status(200).json(response)
    }

}