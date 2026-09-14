'use client';

import { useMemo } from 'react';
import { useListPublishedPosts } from '@/generated/api/content/content';
import {
  POLICY_POST_TYPE,
  toContentPostView,
  type ContentPostView,
} from '../model/content-post.mapper';

export function useContentStories(): {
  stories: ContentPostView[];
  isPending: boolean;
  isError: boolean;
} {
  const query = useListPublishedPosts();
  const stories = useMemo(
    () =>
      (query.data?.items ?? [])
        .filter((post) => post.postType !== POLICY_POST_TYPE)
        .map(toContentPostView),
    [query.data?.items],
  );

  return {
    stories,
    isPending: query.isPending,
    isError: query.isError,
  };
}
