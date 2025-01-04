import { Post } from '../../models/post.model';

export const postMock1: Omit<Post, 'owner'> = {
    title: 'Mock Post',
    content: 'content',
};
