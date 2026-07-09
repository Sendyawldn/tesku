import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestCategory, SessionStatus } from '@prisma/client';

export class StartSessionDto {
  category: TestCategory;
  durationMinutes?: number;
}

export class SubmitAnswerDto {
  questionId: number;
  selectedOptionId?: number;
  numericAnswer?: number;
  booleanAnswer?: boolean;
}

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: number, dto: StartSessionDto) {
    const duration = dto.durationMinutes || 15;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + duration);

    // Check if user already has an active session for this category
    const existingSession = await this.prisma.testSession.findFirst({
      where: {
        userId,
        category: dto.category,
        status: SessionStatus.IN_PROGRESS,
      },
    });

    if (existingSession) {
      return existingSession; // Resume existing session
    }

    return this.prisma.testSession.create({
      data: {
        userId,
        category: dto.category,
        expiresAt,
        status: SessionStatus.IN_PROGRESS,
      },
    });
  }

  async getSessionQuestions(sessionId: number, userId: number) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    // Fetch questions for this category (without correct answers)
    const questions = await this.prisma.question.findMany({
      where: {
        category: session.category!,
      },
      include: {
        options: {
          select: {
            id: true,
            label: true,
            imageUrl: true,
            questionId: true,
            // DO NOT select isCorrect or traitScore
          },
        },
      },
      // In a real app, you might want to randomly sample questions or paginate
      take: 20, 
    });

    // Also fetch previous answers if any (for resuming)
    const answers = await this.prisma.testAnswer.findMany({
      where: { sessionId },
    });

    return { session, questions, answers };
  }

  async submitAnswers(sessionId: number, userId: number, dto: { answers: SubmitAnswerDto[], isFinalSubmit?: boolean }) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is already completed or expired');
    }

    // Auto-save logic: Upsert answers
    for (const answer of dto.answers) {
      const existing = await this.prisma.testAnswer.findFirst({
        where: { sessionId, questionId: answer.questionId },
      });

      if (existing) {
        await this.prisma.testAnswer.update({
          where: { id: existing.id },
          data: {
            selectedOptionId: answer.selectedOptionId,
            numericAnswer: answer.numericAnswer,
            booleanAnswer: answer.booleanAnswer,
            answeredAt: new Date(),
          },
        });
      } else {
        await this.prisma.testAnswer.create({
          data: {
            sessionId,
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOptionId,
            numericAnswer: answer.numericAnswer,
            booleanAnswer: answer.booleanAnswer,
          },
        });
      }
    }

    if (dto.isFinalSubmit) {
      // Calculate score based on answers
      // For simplicity, we just count correct MULTIPLE_CHOICE answers here
      const allAnswers = await this.prisma.testAnswer.findMany({
        where: { sessionId },
        include: { question: { include: { options: true } } },
      });

      let score = 0;
      for (const ans of allAnswers) {
        if (ans.selectedOptionId) {
          const correctOption = ans.question.options.find(o => o.isCorrect);
          if (correctOption && correctOption.id === ans.selectedOptionId) {
            score += 1;
            await this.prisma.testAnswer.update({ where: { id: ans.id }, data: { isCorrect: true } });
          } else {
            await this.prisma.testAnswer.update({ where: { id: ans.id }, data: { isCorrect: false } });
          }
        }
      }

      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.COMPLETED,
          completedAt: new Date(),
          totalScore: score,
        },
      });

      return { success: true, message: 'Test submitted successfully', score };
    }

    return { success: true, message: 'Answers auto-saved' };
  }
}
