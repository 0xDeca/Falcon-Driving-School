import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';

@Injectable()
export class EvaluationsService {
  private readonly model = 'LessonEvaluation';

  constructor(private crud: CrudService) {}

  async findAll(query: any) {
    return this.crud.findAll(this.model, query);
  }

  async findById(id: string) {
    return this.crud.findById(this.model, id);
  }

  async create(data: any) {
    return this.crud.create(this.model, data);
  }

  async update(id: string, data: any) {
    return this.crud.update(this.model, id, data);
  }

  async delete(id: string) {
    return this.crud.delete(this.model, id);
  }
}
