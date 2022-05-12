export interface IRepository {
  name: string;
  url: string;
  language: string;
  clone_url: string;
}

export type TRepository = Extract<IRepository, 'name' | 'url'>;
