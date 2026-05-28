export type WorkflowApiItem = {
  _id: string;
  role: string;
  status: string;
  updatedAt?: string;
  message?: string;
};

export type DashboardComment = {
  author: string;
  role: string;
  time: string;
  text: string;
};

export type DashboardEvent = {
  id: string;
  workflowId: string;
  title: string;
  organizer: string;
  submissionDate: string;
  status: string;
  eventDate: string;
  location: string;
  expectedAttendees: number;
  description: string;
  documents: string[];
  comments: DashboardComment[];
  workflowContent: WorkflowApiItem[];
};

export type UserProfile = {
  fullName?: string;
  role?: string;
};
