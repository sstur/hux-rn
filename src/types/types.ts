export type User = {
  id: string;
  name: string;
  email: string;
  photo: string;
};

export type Post = {
  id: string;
  text: string;
  photo: string;
  owner: User;
  createdAt: string;
  likedByViewer: boolean;
  likeCount: number;
  commentCount: number;
};

export type Comment = {
  id: string;
  text: string;
  owner: User;
  createdAt: string;
};

export type PostList = Array<Post>;
