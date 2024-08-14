import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { Tray } from './tray.schema';
import { TrayService } from './tray.service';
import { UpdateTrayDto } from './tray.dto'; 

@Controller('trays')
export class TrayController {
  constructor(private readonly trayService: TrayService) {}

  // @Get(':id')
  // async getTrayById(@Param('id') id: string): Promise<{ status: boolean; data: Tray | null }> {
  //   const tray = await this.trayService.findById(id);
  //   return {
  //     status: true,
  //     data: tray,
  //   };
  // }

  @Get(':id') 
  async getTrayWithJars(@Param('id') id: string) {
    const trayWithJars = await this.trayService.getTrayWithJars(id);
    return {
      status: true,
      data: trayWithJars,
    };
  }

  // @Put(':id')
  // async updateTray(
  //   @Param('id') id: string,
  //   @Body() trayData: UpdateTrayDto, 
  // ): Promise<{ status: boolean; data: Tray | null }> {
  //   const updatedTray = await this.trayService.update(id, trayData);
  //   return updatedTray
  // }

  @Put(':id')
  async updateTray(
    @Param('id') id: string,
    @Body() trayData: UpdateTrayDto, 
  ): Promise<{ status: boolean; data: Tray | null }> {
    const updatedTray = await this.trayService.update(id, trayData);
    
    await this.trayService.publishTrayUpdate(updatedTray);

    return {
      status: true,
      data: updatedTray,
    };
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