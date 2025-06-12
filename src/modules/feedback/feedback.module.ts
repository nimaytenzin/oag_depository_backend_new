import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback } from './entities/feedback.entity';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService,
    {
      provide: 'FEEDBACK_REPOSITORY',
      useValue: Feedback
    }
  ]
})
export class FeedbackModule { }
