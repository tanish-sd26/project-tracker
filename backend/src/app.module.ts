import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, ClientsModule, ProjectsModule, TasksModule],
})
export class AppModule {}