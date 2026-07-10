import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto) {
    // Check if client exists
    await this.prisma.client.findUniqueOrThrow({
      where: { id: data.clientId },
    });

    try {
      return await this.prisma.project.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Project with this name already exists for this client',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.project.findMany({
      include: { client: true, tasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { client: true, tasks: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, data: UpdateProjectDto) {
    const project = await this.findOne(id);

    // Business Rule: Cannot mark project as Completed if it has incomplete tasks
    if (
      data.status === 'Completed' &&
      project.tasks.some((task) => task.status !== 'Done')
    ) {
      throw new BadRequestException(
        'Cannot mark project as Completed. Please complete all tasks first.',
      );
    }

    return await this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return await this.prisma.project.delete({ where: { id } });
  }
}