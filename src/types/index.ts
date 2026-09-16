export type UserRole = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  schoolId?: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  cover_url?: string;
  description: string;
  theme_color: string;
  contact_email?: string;
  contact_phone?: string;
  invite_code: string;
  created_by_uid: string;
  created_at: string;
}

export interface SchoolMember {
  id: string;
  school_id: string;
  user_uid: string;
  email: string;
  full_name: string;
  role: UserRole;
  joined_at: string;
}

export type AnnouncementCategory = 'Γενικά' | 'Εκδηλώσεις' | 'Αθλητισμός' | 'Εκδρομές' | 'Θέματα Σχολείου';

export interface Announcement {
  id: string;
  school_id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  image_url?: string;
  is_pinned: boolean;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

export interface SchoolEvent {
  id: string;
  school_id: string;
  title: string;
  description: string;
  event_date: string;
  event_time?: string;
  location?: string;
  cover_image_url?: string;
  external_link?: string;
  created_at: string;
}

export type IdeaCategory = 'Γενικά' | 'Υποδομές' | 'Εκδηλώσεις' | 'Περιβάλλον' | 'Αθλητισμός' | 'Μαθήματα';
export type IdeaStatus = 'new' | 'under_review' | 'accepted' | 'rejected';

export interface StudentIdea {
  id: string;
  school_id: string;
  student_uid: string;
  student_name: string;
  title: string;
  description: string;
  category: IdeaCategory;
  status: IdeaStatus;
  admin_response?: string;
  created_at: string;
  updated_at?: string;
}
