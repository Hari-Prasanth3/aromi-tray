import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TrayService } from './tray.service';
import { CreateTrayDto } from './tray.dto';
import { AuthGuard } from '../utils/authGuard';

@Controller('trays')
export class TrayController {
  constructor(private readonly trayService: TrayService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createTrayDto: CreateTrayDto,
    @Req() req: any,  // Request object to get the user from the request
  ) {
    const userId = req.user._id; // Assuming the user object is attached to req
    const tray = await this.trayService.create(createTrayDto, userId);
    return {
      status: true,
      data: tray,
    };
  }
}
