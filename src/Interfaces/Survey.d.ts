interface Author {
  id: number;
  username: string;
  avatar_url: string;
  admin: boolean;
  created_at: string;
  updated_at: string;
}
export interface Survey {
  data: Array<{
    author_id: number;
    created_at: string;
    end_at: string | null;
    id: string;
    multiple_responses: boolean;
    public: boolean;
    start_at: string;
    title: string;
    updated_at: string;
    author: Author;
  }>;
}
