import { Controller, Get, Param } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}
  @Get('/:profile')
  getRepositories(@Param('profile') profile: string) {
    return this.repositoriesService.getRepositories(profile);
  }

  @Get('/:profile/:repo')
  getCommits(@Param('profile') profile: string, @Param('repo') repo: string) {
    return this.repositoriesService.getCommits(profile, repo);
  }

  @Get('/:profile/:repo/contents')
  getContents(@Param('profile') profile: string, @Param('repo') repo: string) {
    return this.repositoriesService.getContentList(profile, repo);
  }

  @Get('/:profile/:repo/contents/:commit')
  getContentsCommit(
    @Param('profile') profile: string,
    @Param('repo') repo: string,
    @Param('commit') commit: string,
  ) {
    return this.repositoriesService.getCommitContentList(profile, repo, commit);
  }
}
