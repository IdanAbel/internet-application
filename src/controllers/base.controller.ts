import { Request, Response } from 'express';
import { Model } from 'mongoose';

export class BaseController<T> {
    constructor(private model: Model<T>) {}

    async getAll(req: Request, res: Response) {
        try {
            const filter = req.query.owner;
            const items = await this.model.find(filter ? { owner: filter } : {});
            res.send(items);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                res.status(404).send('Not Found');
            } else {
                res.send(item);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const item = await this.model.create(req.body);
            res.status(201).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteItem(req: Request, res: Response) {
        try {
            const rs = await this.model.findByIdAndDelete(req.params.id);
            if (!rs) {
                res.status(404).send('Not Found');
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
}
