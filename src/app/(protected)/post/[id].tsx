import comments from '@/assets/data/comments.json';
import CommentListItem from '@/src/components/CommentListItem';
import PostListItem from '@/src/components/PostListItem';
import {fetchPostById} from '@/src/services/postService';
import {useQuery} from '@tanstack/react-query';
import {useLocalSearchParams} from 'expo-router';
import {useCallback, useRef, useState} from 'react';
import {
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function DetailedPost() {
	const {id} = useLocalSearchParams<{id: string}>();

	const insets = useSafeAreaInsets();

	const [comment, setComment] = useState<string>('');
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
	const inputRef = useRef<TextInput | null>(null);

	// useCallback with memo inside CommentListItem prevents re-renders when replying to a comment - must be before any other hook
	const handleReplyPress = useCallback((commentId: string) => {
		console.log(commentId);
		inputRef.current?.focus();
	}, []);

	const {
		data: detailedPost,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['posts', id],
		queryFn: async () => {
			const result = await fetchPostById(id);
			return result;
		},
	});

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error || !detailedPost) {
		return <Text>Post not found</Text>;
	}

	const postComments = comments.filter(
		(comment) => comment.post_id === detailedPost?.id,
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{flex: 1}}
			keyboardVerticalOffset={insets.top + 10}>
			<FlatList
				ListHeaderComponent={
					<PostListItem
						post={detailedPost}
						isDetailedPost
					/>
				}
				data={postComments}
				keyExtractor={(item) => item.id}
				renderItem={({item}) => (
					<CommentListItem
						comment={item}
						depth={0}
						handleReplyPress={handleReplyPress}
					/>
				)}
			/>
			{/* POST A COMMENT */}
			<View
				style={{
					paddingBottom: insets.bottom,
					borderBottomWidth: 1,
					borderBottomColor: 'lightgrey',
					padding: 10,
					backgroundColor: 'white',
					borderRadius: 10,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: -3,
					},
					shadowOpacity: 0.1,
					shadowRadius: 3,

					elevation: 4,
				}}>
				<TextInput
					placeholder='Join the conversation'
					ref={inputRef}
					value={comment}
					onChangeText={(text) => setComment(text)}
					style={{backgroundColor: '#E4E4E4', padding: 5, borderRadius: 5}}
					multiline
					onFocus={() => setIsInputFocused(true)}
					onBlur={() => setIsInputFocused(false)}
				/>
				{isInputFocused && (
					<Pressable
						disabled={!comment}
						onPress={() => console.error('Pressed')}
						style={{
							backgroundColor: !comment ? 'lightgrey' : '#0d469b',
							borderRadius: 15,
							marginLeft: 'auto',
							marginTop: 15,
						}}>
						<Text
							style={{
								color: 'white',
								paddingVertical: 5,
								paddingHorizontal: 10,
								fontWeight: 'bold',
								fontSize: 13,
							}}>
							Reply
						</Text>
					</Pressable>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}
