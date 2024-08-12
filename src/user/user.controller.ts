import { Controller, Get, Delete, Body, HttpException, HttpStatus, Put, UseGuards, Req, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/utils/authGuard';
import { UpdateUserDto } from './user.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUserById(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user._id;
      const user = await this.userService.findById(userId);
      return {
        status: true,
        data: user
      };
        } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Delete('')
  async deleteUserById(@Req() req: any) {
    try {
      const userId = req.user._id;

      await this.userService.findById(userId);

      const updateResult = await this.userService.update(userId, { status: 'deleted' });

      if (!updateResult.status) {
        throw new HttpException('Error updating user status', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        status: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }}
  

  @Put('')
  async updateUser(
    @Req() req: any,
    @Body() updateData: UpdateUserDto 
  ) {
    try {
      const userId = req.user._id;
      
      const result = await this.userService.update(userId, updateData);

      return {
        status: true,
        message: result.message,
        data: result.user
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  }
  
  
  

