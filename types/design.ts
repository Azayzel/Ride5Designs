export interface Design {
  Bike: string;
  Name: string;
  AuthorId: string;
  CreatedOn: string; // MM-DD-YYYY
  Tags: string[];
  Thumbnail: string; // URL path under public/
  Collection: string[]; // URLs to images under public/
}