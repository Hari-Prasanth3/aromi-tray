import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jar, JarSchema } from './jar.schema';
import { JarService } from './jar.service'; // Ensure you have a service for Jar

@Module({
  imports: [MongooseModule.forFeature([{ name: Jar.name, schema: JarSchema }])],
  providers: [JarService], // Provide JarService
  exports: [JarService], // Export JarService
})
export class JarModule {}
