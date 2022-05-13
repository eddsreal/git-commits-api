import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import {
  ICommit,
  IFile,
  IFileTree,
  IRepository,
  ReturnedIFile,
} from './repositories.interface';
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

  async getContentList(profile: string, repo: string): Promise<IFile[]> {
    const { data }: AxiosResponse<ReturnedIFile[]> = await lastValueFrom(
      this.axios.get<ReturnedIFile[]>(
        `https://api.github.com/repos/${profile}/${repo}/contents`,
      ),
    ).catch((err: AxiosError) => {
      Logger.error(
        //  prettier-ignore
        `Github Request Error Message: ${JSON.stringify(err.message)} stack: ${JSON.stringify(err.stack)}`,
      );
      throw new NotFoundException('Files not found');
    });
    if (data.length > 0) {
      return data.map((file: ReturnedIFile) => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        type: file.type,
        gitUrl: file.git_url,
        size: file.size,
      }));
    }
    throw new NotFoundException('Files not found');
  }

  async getCommitContentList(
    profile: string,
    repo: string,
    commit: string,
  ): Promise<IFile[]> {
    const { data }: AxiosResponse<IFileTree> = await lastValueFrom(
      this.axios.get<IFileTree>(
        `https://api.github.com/repos/${profile}/${repo}/git/trees/${commit}`,
      ),
    ).catch((err: AxiosError) => {
      Logger.error(
        //  prettier-ignore
        `Github Request Error Message: ${JSON.stringify(err.message)} stack: ${JSON.stringify(err.stack)}`,
      );
      throw new NotFoundException('Commit not found');
    });
    console.log(data);
    if (data.tree.length > 0) {
      return data.tree.map((file: ReturnedIFile) => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        type: file.type,
        gitUrl: file.url,
        size: file.size,
      }));
    }
    throw new NotFoundException('commit not found');
  }
}
