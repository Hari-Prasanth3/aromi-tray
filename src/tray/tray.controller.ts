import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Put } from '@nestjs/common';
import { Tray } from './tray.schema';
import { TrayService } from './tray.service';
import { UpdateTrayDto } from './tray.dto'; 

@Controller('trays')
export class TrayController {
  constructor(private readonly trayService: TrayService) {}

  @Get(':id') 
  async getTrayWithJars(@Param('id') id: string) {
    const trayWithJars = await this.trayService.getTrayWithJars(id);
    return {
      status: true,
      data: trayWithJars,
    };
  }

  @Put(':id')
  async updateTray(@Param('id') id: string, @Body() updateTrayDto: UpdateTrayDto) {
    const updatedTray = await this.trayService.update(id, updateTrayDto);

    if (!updatedTray) {
      throw new NotFoundException('Tray not found');
    }

    return updatedTray; 
  }

  @Delete(':id')
  async deleteTray(@Param('id') id: string): Promise<{ status: boolean; data: Tray | null }> {
    const deletedTray = await this.trayService.Delete(id);
    return {
      status: true,
      data: deletedTray,
    };
  }
}