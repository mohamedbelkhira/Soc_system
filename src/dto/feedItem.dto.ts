
export interface Tag {
    tagId: string;
    name: string;
    color?: string;
  }

  export interface Feed {
     feedId: string;
     url: string;
     title?: string | null;
     description?: string | null;
     active: boolean;
     lastChecked?: string | null;
     createdAt: string;
     updatedAt: string;
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
    feed : Feed;
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