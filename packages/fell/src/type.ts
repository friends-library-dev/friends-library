import { Arguments } from 'yargs';

export type Repo = string;

export type Argv = Arguments<{
  scope?: string;
  exclude: string[];
}>;
