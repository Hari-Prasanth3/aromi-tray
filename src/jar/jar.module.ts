import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jar, JarSchema } from './jar.schema';
import { JarService } from './jar.service'; 
import { JarController } from './jar.controller';
import { TrayModule } from 'src/tray/tray.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Jar.name, schema: JarSchema }]),
  forwardRef(() => TrayModule),],
  controllers: [JarController],

  providers: [JarService], 
  exports: [JarService,MongooseModule], 
})
export class JarModule {}
