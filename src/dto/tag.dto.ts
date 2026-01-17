export interface TagResponse {
  tagId: string;
  name: string;
  color?: string | null;
}

export interface CreateTagDTO {
  name: string;
  color?: string;
}

export interface UpdateTagDTO {
  name?: string;
  color?: string;
}
