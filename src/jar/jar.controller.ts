import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { JarService } from './jar.service';
import { CreateJarDto, UpdateJarDto } from './jar.dto';

@Controller('jars')
export class JarController {
  constructor(private readonly jarService: JarService) {}

  @Post()
  async createJar(@Body() jarData: CreateJarDto) {
    const jar = await this.jarService.createJar(jarData);
    return {
      status: true,
      data: jar,
    };
  }

  @Get(':id')
  async getJarById(@Param('id') id: string) {
    const jar = await this.jarService.findById(id);
    return {
      status: true,
      data: jar,
    };
  }

  @Put(':id') 
  async updateJar(
    @Param('id') id: string,
    @Body() jarData: UpdateJarDto,
  ) {
    const updatedJar = await this.jarService.update(id, jarData);
    return {
      status: true,
      data: updatedJar,
    };
  }

  @Delete(':id')
  async deleteJar(@Param('id') id: string) {
    const deletedJar = await this.jarService.Delete(id);
    return {
      status: true,
      data: deletedJar,
    };
  }

  @Get('tray/:id') 
  async getJarsByTrayId(@Param('id') trayId: string) {
    const jars = await this.jarService.getJarsByTrayId(trayId); 
    return {
      status: true,
      data: jars,
    };
  }
}