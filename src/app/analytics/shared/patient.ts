import {Gender} from './gender';

export interface Patient {
  id: string;
  sourceId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  address: string;
  age: number;
}
