export interface Tag {
    tagId: string;
    name: string;
    color?: string;
  }
  
  export interface FeedItemResponse {
    itemId: string;
    feedId: string;
    title?: string;
    link: string;
    publishedDate?: Date;
    content?: string;
    guid?: string;
    readStatus: boolean;
    imageUrl?: string;
    tags: Tag[];
  }
  
  export interface CreateFeedItemDTO {
    feedId: string;
    title?: string;
    link: string;
    publishedDate?: Date;
    content?: string;
    guid?: string;
    readStatus?: boolean;
    imageUrl?: string;
    tags?: string[];
  }
  
  export interface UpdateFeedItemDTO {
    feedId?: string;
    title?: string;
    link?: string;
    publishedDate?: Date;
    content?: string;
    guid?: string;
    readStatus?: boolean;
    imageUrl?: string;
    tags?: string[];
  }