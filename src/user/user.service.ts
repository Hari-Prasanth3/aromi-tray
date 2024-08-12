import { Injectable, HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) 
    private readonly user: Model<UserDocument>,
  ) {
    super(user)
  }


  // async updateUser(userId: string, updateData: Partial<{ phoneNumber: string, name: string, notification: boolean }>): Promise<{ message: string, user?: User }> {
  //   try {
  //     if (!Types.ObjectId.isValid(userId)) {
  //       throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
  //     }
  
  //     if (!updateData.phoneNumber && !updateData.name && updateData.notification === undefined) {
  //       throw new HttpException('At least one field (phoneNumber, name, or notification) must be provided', HttpStatus.BAD_REQUEST);
  //     }
  
  //     const existingUser = await this.userModel.findById(userId);
  //     if (!existingUser) {
  //       throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //     }
  
  //     if (updateData.phoneNumber) {
  //       const phoneNumberDigitsOnly = updateData.phoneNumber.replace(/^\+(\d{1,3})/, ''); 
  //       if (!/^\d{10}$/.test(phoneNumberDigitsOnly)) {
  //         throw new UnprocessableEntityException('Phone number must be 10 digits long.');
  //       }
  
  //       const phoneNumberExists = await this.userModel.findOne({ phoneNumber: updateData.phoneNumber });
  //       if (phoneNumberExists && phoneNumberExists._id.toString() !== userId) {
  //         throw new HttpException('Phone number is already in use', HttpStatus.BAD_REQUEST);
  //       }
  //     }
  
  //     const updates: Partial<{ phoneNumber: string, name: string, notification: boolean }> = {};
  //     let message = 'User updated successfully';
  
  //     if (updateData.phoneNumber) {
  //       if (updateData.phoneNumber === existingUser.phoneNumber) {
  //         message = 'Phone number is already up-to-date';
  //       } else {
  //         updates['phoneNumber'] = updateData.phoneNumber;
  //       }
  //     }
  //     if (updateData.name) {
  //       if (updateData.name === existingUser.name) {
  //         message = 'Name is already up-to-date';
  //       } else {
  //         updates['name'] = updateData.name;
  //       }
  //     }
  //     if (updateData.notification !== undefined) {
  //       if (updateData.notification === existingUser.notification) {
  //         message = 'Notification status is already up-to-date';
  //       } else {
  //         updates['notification'] = updateData.notification;
  //       }
  //     }
  
  //     if (Object.keys(updates).length === 0) {
  //       throw new HttpException(message, HttpStatus.BAD_REQUEST);
  //     }
  
  //     const updatedUser = await this.userModel.findByIdAndUpdate(
  //       userId,
  //       { ...updates, updatedAt: new Date() },
  //       { new: true }
  //     );
  
  //     if (!updatedUser) {
  //       throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  
  //     return {
  //       message,
  //       user: updatedUser
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  
  
  

  // async deleteUserById(userId: string): Promise<{ message: string }> {
  //   try {
  //     if (!Types.ObjectId.isValid(userId)) {
  //       throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
  //     }

  //     const result = await this.userModel.findByIdAndDelete(userId);
  //     if (!result) {
  //       throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //     }
  //     return { message: 'User deleted successfully' };
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
