import { Model, Document, FilterQuery, ObjectId } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class BaseService<T extends Document> {
  constructor(
    private readonly model: Model<T>,
  ) { }

  async create(params: any): Promise<any> {
    try {
      console.log(params);
      const newUser = new this.model(params);
      const savedUser = await newUser.save();
      return {
        status: true,
        message: 'Created Successfully..!',
        data: savedUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new UnprocessableEntityException(
          `Failed to create user: ${error.message}`,
        );
      }
    }
  }

  async update(id: any, params: any): Promise<any> {
    try {
      const data = await this.model.findByIdAndUpdate(id, params);
      if (!data) {
        throw error;
      }
      return {
        status: true,
        data: await this.model.findById(id),
        message: 'Updated Successfully..!',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new NotFoundException(
          `Failed to Update: ${error.message || ''}Record`,
        );
      }
    }
  }


  async findAll(query: FilterQuery<T>) {
    return await this.model.find(query).lean();
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(query).lean();
  }

  async findOneSelect(query: FilterQuery<T>, selectQuery: any): Promise<T | null> {
    return await this.model.findOne(query, selectQuery).lean();
  }

  async findById(id: string): Promise<T | null> {
    const entity = await this.model.findOne({ _id: id } as FilterQuery<T>).lean() as T | null;
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async findOnePopulate(query: any) {
    const data = await this.model.findOne(query.find).populate(query.populateQuery).lean();
    return data;
  }

  async updateOne(query: any) {
    const data = await this.model.updateOne(query.find, query.updateQuery).lean();
    return data;
  }

  async Delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async getAll(query: any) {
    console.log(query);
    const data = await this.model
      .find(query.filterQuery, query.projectQuery)
      .populate(query.populateQuery)
      .sort({ [query.sort]: query.order })
      .skip(query.skip)
      .limit(query.limit)
      .select(query.selectedFields)
      .lean();
    return data;
  }

  async count(filterQuery: any = {}) {
    try {
      return await this.model.countDocuments(filterQuery);
    } catch (error) {
      return 0;
    }
  }

  async validateDate(date: any) {
    const given = new Date(date);
    const current = new Date();
    if (
      !(
        given.getFullYear() === current.getFullYear() &&
        given.getMonth() === current.getMonth() &&
        given.getDate() === current.getDate()
      )
    ) {
      console.log('The given date is not equal to the current date.');
      throw new UnprocessableEntityException(
        'The given date is not equal to the current date.',
      );
    }
  }

  async formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async userName(firstName, lastName){
    try {
      lastName = lastName || ''
      firstName = firstName || 'Customer'
      return `${firstName} ${lastName}`.trim();
    }catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
