export type Enquiry = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  comment: string;
  status: "Submitted" | "Contacted" | "In Progress" | "Resolved";
  createdAt?: string;
  updatedAt?: string;
}; 