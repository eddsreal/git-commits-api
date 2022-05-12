import { Controller, Get, Param } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}
  @Get('/:profile')
  getRepositories(@Param('profile') profile: string) {
    return this.repositoriesService.getRepositories(profile);
  }
}
