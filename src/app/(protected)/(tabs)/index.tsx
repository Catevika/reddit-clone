import PostListItem from '@/src/app/components/PostListItem';
import {useAuth} from '@clerk/clerk-expo';
import {useQuery} from '@tanstack/react-query';
import {ActivityIndicator, FlatList, Text} from 'react-native';
import {fetchPosts} from '../../../../services/postService';

export default function HomeScreen() {
	const {getToken} = useAuth();

	const {
		data: posts,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');
			return fetchPosts(token);
		},
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
