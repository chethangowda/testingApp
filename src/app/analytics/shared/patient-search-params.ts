import {Gender} from './gender';

export interface PatientSearchParams {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
}
