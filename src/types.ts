export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  createdAt: any;
}

export interface Video {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorPhoto: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: 'short' | 'long';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  createdAt: any;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}

export interface LiveStream {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  viewerCount: number;
  status: 'live' | 'ended';
  createdAt: any;
}
