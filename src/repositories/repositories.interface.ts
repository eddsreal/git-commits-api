export interface IRepository {
  name: string;
  url: string;
  language: string;
  clone_url: string;
}

interface IAuthor {
  name: string;
  email: string;
}

export interface ICommit {
  sha: string;
  commit: {
    author: IAuthor;
    message: string;
  };
}