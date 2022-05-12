import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { ICommit, IRepository } from './repositories.interface';
import config from '../config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RepositoriesService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private axios: HttpService,
  ) {}
  async getRepositories(profile: string): Promise<IRepository[]> {
    const { data }: AxiosResponse<IRepository[]> = await lastValueFrom(
      this.axios.get<IRepository[]>(
        `https://api.github.com/users/${profile}/repos`,
      ),
    ).catch((err: AxiosError) => {
      Logger.error(
        //  prettier-ignore
        `Github Request Error Message: ${JSON.stringify(err.message)} stack: ${JSON.stringify(err.stack)}`,
      );
      throw new NotFoundException('Repository not found');
    });
    if (data.length > 0) {
      return data.map((repo: IRepository) => ({
        name: repo.name,
        url: repo.url,
        language: repo.language,
        clone_url: repo.clone_url,
      }));
    }
    throw new NotFoundException('Repository not found');
  }

  async getCommits(profile: string, repo: string): Promise<ICommit[]> {
    const { data }: AxiosResponse<ICommit[]> = await lastValueFrom(
      this.axios.get<ICommit[]>(
        `https://api.github.com/repos/${profile}/${repo}/commits`,
      ),
    ).catch((err: AxiosError) => {
      Logger.error(
        //  prettier-ignore
        `Github Request Error Message: ${JSON.stringify(err.message)} stack: ${JSON.stringify(err.stack)}`,
      );
      throw new NotFoundException('Commits not found');
    });
    if (data.length > 0) {
      return data.map((commit: ICommit) => ({
        sha: commit.sha,
        commit: {
          author: {
            name: commit.commit.author.name,
            email: commit.commit.author.email,
          },
          message: commit.commit.message,
        },
      }));
    }
    throw new NotFoundException('Commits not found');
  }
}
