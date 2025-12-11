export type Category = 'Bug' | 'Billing' | 'Feature Request' | 'General';
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'New' | 'In Progress' | 'Resolved';

export interface SupportMessage {
  id: string;
  customerName: string;
  email: string;
  message: string;
  timestamp: Date;
  category: Category;
  priority: Priority;
  status: Status;
}

export interface FilterOptions {
  category?: Category;
  priority?: Priority;
  status?: Status;
}