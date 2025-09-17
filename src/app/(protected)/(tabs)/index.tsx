import PostListItem from '@/src/components/PostListItem';
import {fetchPosts} from '@/src/services/postService';
import {useQuery} from '@tanstack/react-query';
import {ActivityIndicator, FlatList, Text} from 'react-native';

export default function HomeScreen() {
	const {
		data: posts,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['posts'],
		queryFn: () => fetchPosts(),
	});

	if (isLoading) {
		<ActivityIndicator />;
	}

	if (error) {
		console.log(error);
		return <Text>Error fetching posts</Text>;
	}

	return (
		<FlatList
			data={posts}
			renderItem={({item}) => <PostListItem post={item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{padding: 16}}
			onRefresh={refetch}
			refreshing={isRefetching}
		/>
	);
}
