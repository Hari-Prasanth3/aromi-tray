import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Jar } from './jar.schema';
import { JarService } from './jar.service';

@Controller('jars')
export class JarController {
  constructor(private readonly jarService: JarService) {}

  @Get('tray/:id')
  async getJarsByTrayId(@Param('id') trayId: string): Promise<Jar[]> {
    return this.jarService.getJarsByTrayId(trayId);
  }

  @Get(':id')
  async getJarById(@Param('id') id: string): Promise<Jar | null> {
    return this.jarService.getJarById(id);
  }

  @Patch(':id')
  async updateJar(
    @Param('id') id: string,
    @Body() jarData: Partial<Jar>,
  ): Promise<Jar | null> {
    return this.jarService.updateJar(id, jarData);
  }

  @Delete(':id')
  async deleteJar(@Param('id') id: string): Promise<Jar | null> {
    return this.jarService.deleteJar(id);
  }
}