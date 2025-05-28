export interface Request {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  language: string;
  level: string;
  class_type: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  class_size: string;
  price: string;
  features: string[];
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  enrollment_date: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author_id: string;
  status: string;
  published_at: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  status: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
} 