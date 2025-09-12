import posts from '@/assets/data/posts.json';
import PostListItem from '@/src/components/PostListItem';
import {useLocalSearchParams} from 'expo-router';
import {Text, View} from 'react-native';

const DetailedPost = () => {
	const {id} = useLocalSearchParams();

	const DetailedPost = posts.find((post) => post.id === id);

	return (
		<View>
			{DetailedPost ? (
				<PostListItem
					post={DetailedPost}
					isDetailedPost
				/>
			) : (
				<Text>Post not found</Text>
			)}
		</View>
	);
};

export default DetailedPost;
