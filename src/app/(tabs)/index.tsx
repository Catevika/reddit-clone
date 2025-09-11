import posts from '@/assets/data/posts.json';
import PostListItem from '@/src/components/PostListItem';
import {FlatList} from 'react-native';

export default function HomeScreen() {
	return (
		<FlatList
			data={posts}
			renderItem={({item}) => <PostListItem post={item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{padding: 16}}
		/>
	);
}
