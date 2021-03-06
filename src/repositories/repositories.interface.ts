export interface IRepository {
  name: string;
  language: string;
  clone_url: string;
  description: string;
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
    tree: {
      sha: string;
      url: string;
    };
  };
}

export interface ReturnedIFile {
  name: string;
  path: string;
  sha: string;
  type: string;
  git_url: string;
  url: string;
  size: number;
}

export interface IFile {
  name: string;
  path: string;
  sha: string;
  type: string;
  gitUrl: string;
  size: number;
}

export interface IFileTree {
  sha: string;
  tree: ReturnedIFile[];
}
