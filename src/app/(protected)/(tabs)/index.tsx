import {fetchPosts} from '@/services/postService';
import type {Tables} from '@/types/database.types';
import {useAuth} from '@clerk/clerk-expo';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ActivityIndicator, FlatList, Text} from 'react-native';
import PostListItem from '../../components/PostListItem';

type Post = Tables<'posts'> & {
	user: Tables<'users'>;
	group: Tables<'groups'>;
	totalUpvotes: {sum: number}[];
	upvote: Tables<'upvotes'>;
	nb_comments: {count: number}[] | null;
};

const LIMIT = 2;

export default function HomeScreen() {
	const {getToken} = useAuth();

	const {
		data,
		isLoading,
		error,
		refetch,
		isRefetching,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ['posts'],
		queryFn: async ({pageParam}) => {
			const token = await getToken();
			if (!token) throw new Error('No token found');

			const result = await fetchPosts(pageParam.offset, pageParam.limit, token);

			return {
				posts: result.data,
				nextOffset: result.hasMore
					? pageParam.offset + pageParam.limit
					: undefined,
			};
		},

		initialPageParam: {offset: 0, limit: LIMIT},
		getNextPageParam: (lastPage) =>
			lastPage.nextOffset !== undefined
				? {offset: lastPage.nextOffset, limit: LIMIT}
				: undefined,
	});

	if (isLoading) return <ActivityIndicator />;
	if (error) return <Text>Error loading posts</Text>;

	const posts = data?.pages.flatMap((page) => page.posts) || [];

	return (
		<FlatList
			data={posts}
			renderItem={({item}) => <PostListItem post={item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{padding: 16}}
			onRefresh={refetch}
			refreshing={isRefetching}
			onEndReachedThreshold={0.1}
			onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
			ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
		/>
	);
}
