import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { Tray } from './tray.schema';
import { TrayService } from './tray.service';

@Controller('trays')
export class TrayController {
  constructor(private readonly trayService: TrayService) {}

  @Get(':id')
  async getTrayById(@Param('id') id: string): Promise<Tray | null> {
    return this.trayService.getTrayById(id);
  }

  @Put(':id')
  async updateTray(
    @Param('id') id: string,
    @Body() trayData: Partial<Tray>,
  ): Promise<Tray | null> {
    return this.trayService.updateTray(id, trayData);
  }

  @Delete(':id')
  async deleteTray(@Param('id') id: string): Promise<Tray | null> {
    return this.trayService.deleteTray(id);
  }
}