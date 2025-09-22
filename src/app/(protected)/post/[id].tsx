import {fetchComments} from '@/services/commentServices';
import {deletePostById, fetchPostById} from '@/services/postService';
import CommentListItem from '@/src/app/components/CommentListItem';
import PostListItem from '@/src/app/components/PostListItem';
import {useAuth, useUser} from '@clerk/clerk-expo';
import {Feather} from '@expo/vector-icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {useCallback, useRef, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
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
	const {getToken} = useAuth();

	const {user, isLoaded} = useUser();
	if (!isLoaded) return <ActivityIndicator />;

	const {id} = useLocalSearchParams<{id: string}>();

	const queryClient = useQueryClient();

	const insets = useSafeAreaInsets();

	const [comment, setComment] = useState<string>('');
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
	const inputRef = useRef<TextInput | null>(null);

	const [showReplies, setShowReplies] = useState<boolean>(false);

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
			const token = await getToken();
			if (!token) throw new Error('No token found');
			const result = await fetchPostById(token, id);
			return result;
		},
	});

	const isOwner = user?.id.includes(detailedPost?.user_id || '');

	const {
		data: comments,
		isLoading: commentsLoading,
		error: commentsError,
	} = useQuery({
		queryKey: ['comments'],
		queryFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');
			return fetchComments(token);
		},
	});

	const {mutate: removePost} = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');
			return deletePostById(token, id);
		},
		onSuccess: () => {
			console.log('Post deleted');
			queryClient.invalidateQueries({queryKey: ['posts']});
			router.back();
		},
		onError: (error) => {
			console.log(error);
			Alert.alert('Failed to delete Post', error.message);
		},
	});

	if (isLoading || commentsLoading) {
		return <ActivityIndicator />;
	}

	if (error || !detailedPost) {
		return <Text>Post not found</Text>;
	}

	if (!comments) {
		return <Text>Be the 1st to write a comment</Text>;
	}

	if (commentsError) {
		return <Text>Error loading comments</Text>;
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
					<View>
						<Stack.Screen
							options={{
								headerRight: () => (
									<View style={{flexDirection: 'row', gap: 10}}>
										{isOwner && (
											<Feather
												name='trash-2'
												size={24}
												color='white'
												onPress={() => removePost()}
											/>
										)}
									</View>
								),
							}}
						/>
						<PostListItem
							post={detailedPost}
							isDetailedPost
						/>
					</View>
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
