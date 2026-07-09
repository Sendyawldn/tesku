import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { SessionsService, StartSessionDto, SubmitAnswerDto } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('start')
  startSession(@Request() req: any, @Body() dto: StartSessionDto) {
    return this.sessionsService.startSession(req.user.sub, dto);
  }

  @Get(':id/questions')
  getSessionQuestions(@Request() req: any, @Param('id') id: string) {
    return this.sessionsService.getSessionQuestions(+id, req.user.sub);
  }

  @Get('my-history')
  getMyHistory(@Request() req: any) {
    return this.sessionsService.getMyHistory(req.user.sub);
  }

  @Post(':id/submit')
  submitAnswers(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { answers: SubmitAnswerDto[]; isFinalSubmit?: boolean },
  ) {
    return this.sessionsService.submitAnswers(+id, req.user.sub, dto);
  }
}
