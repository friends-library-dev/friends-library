import { Uuid, Job } from '@friends-library/types';
import { State } from '../type';

export default function chapterJob(state: State, taskId: Uuid, path: string): Job {
  return {
    target: 'pdf-print',
  };
}
