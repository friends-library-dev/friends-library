export type PrintJobStatus =
  | 'pending'
  | 'accepted'
  | 'shipped'
  | 'rejected'
  | 'cancelled';

export interface Address {
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
