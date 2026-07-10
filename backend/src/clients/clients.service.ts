import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    try {
      return await this.prisma.client.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Client name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.client.findMany({
      include: { projects: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { projects: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: number, data: UpdateClientDto) {
    await this.findOne(id); // Check if exists
    try {
      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Client name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return await this.prisma.client.delete({ where: { id } });
  }
}