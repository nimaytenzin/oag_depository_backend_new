import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('FEEDBACK_REPOSITORY')
    private feedbackRepository: typeof Feedback
  ) { }

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackRepository.create(createFeedbackDto);
  }

  findAll() {
    return this.feedbackRepository.findAll<Feedback>({
      order: [['createdAt', 'DESC']],
    });
  }
}
