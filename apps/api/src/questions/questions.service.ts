import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionType, TestCategory } from '@prisma/client';

export class CreateQuestionDto {
  category: TestCategory;
  type: QuestionType;
  prompt: string;
  difficultyLevel?: number;
  options?: Array<{
    label: string;
    isCorrect: boolean;
  }>;
}

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        skip,
        take: limit,
        include: {
          options: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.question.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async create(data: CreateQuestionDto) {
    const { options, ...questionData } = data;
    
    return this.prisma.question.create({
      data: {
        ...questionData,
        options: options?.length ? {
          create: options
        } : undefined,
      },
      include: {
        options: true,
      },
    });
  }

  async remove(id: number) {
    // Delete options first due to foreign key constraints if not cascaded
    await this.prisma.questionOption.deleteMany({
      where: { questionId: id },
    });

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
