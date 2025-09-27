import {
	deleteCommentById,
	fetchCommentReplies,
	type Comment,
} from '@/services/commentServices';
import {useAuth, useUser} from '@clerk/clerk-expo';
import {Feather, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {memo, useState} from 'react';
import {Alert, FlatList, Pressable, Text, View} from 'react-native';

type CommentListItemProps = {
	comment: Comment;
	depth: number;
	handleReplyPress: (commentId: string) => void;
};

const CommentListItem = ({
	comment,
	depth,
	handleReplyPress,
}: CommentListItemProps) => {
	const {getToken} = useAuth();

	const {user} = useUser();
	if (!user) throw new Error('User not found');

	const queryClient = useQueryClient();

	const [showReplies, setShowReplies] = useState(false);

	const {data: replies} = useQuery({
		queryKey: ['comments', {parent_id: comment.id}],
		queryFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');

			return fetchCommentReplies(comment.id, token);
		},
	});

	const isOwner = user.id === comment?.user_id || '';

	const {mutate: deleteComment, isPending} = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');
			return deleteCommentById(token, comment.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['comments', {post_id: comment.post_id}],
			});
			queryClient.invalidateQueries({
				queryKey: ['comments', {parent_id: comment.parent_id}],
			});
		},
		onError: (error) => {
			console.log(error);
			Alert.alert('Failed to delete Comment', error.message);
		},
	});

	if (!comment || isPending) return null;

	return (
		<View
			style={{
				backgroundColor: 'white',
				marginTop: 10,
				paddingHorizontal: 10,
				paddingVertical: 5,
				gap: 10,
				borderLeftWidth: depth > 0 ? 1 : 0,
				borderLeftColor: '#E5E7EB',
			}}>
			{/* User Info */}
			{/* <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
				{comment && comment.user ? (
					<>
						{comment.user.image && (
							<Image
								source={{
									uri:
										comment.user.image ||
										'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg',
								}}
								style={{
									width: 28,
									height: 28,
									borderRadius: 15,
									marginRight: 4,
								}}
							/>
						)}
						{comment.user.name ? (
							<Text style={{fontWeight: '600', color: '#737373', fontSize: 13}}>
								{comment.user.name || 'User'}
							</Text>
						) : null}
					</>
				) : null}
				<Text style={{color: '#737373', fontSize: 13}}>&#x2022;</Text>
				<Text style={{color: '#737373', fontSize: 13}}>
					{comment.created_at &&
						formatDistanceToNowStrict(new Date(comment.created_at.toString()))}
				</Text>
			</View> */}

			{/* Comment Content */}
			<Text>{comment.comment}</Text>

			{/* Comment Actions */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center',
					gap: 14,
				}}>
				{isOwner ? (
					<Feather
						name='trash-2'
						size={15}
						color='#737373'
						onPress={() => deleteComment()}
						style={{
							opacity: isPending ? 0.5 : 1,
							pointerEvents: isPending ? 'none' : 'auto',
						}}
					/>
				) : null}
				<Octicons
					name='reply'
					size={16}
					color='#737373'
					onPress={() => handleReplyPress(comment.id)}
				/>
				<MaterialCommunityIcons
					name='trophy-outline'
					size={16}
					color='#737373'
				/>
				<View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
					<MaterialCommunityIcons
						name='arrow-up-bold-outline'
						size={18}
						color='#737373'
					/>
					<Text style={{fontWeight: '500', color: '#737373'}}>
						{comment.upvotes}
					</Text>
					<MaterialCommunityIcons
						name='arrow-down-bold-outline'
						size={18}
						color='#737373'
					/>
				</View>
			</View>

			{/* Show Replies Button */}
			{replies && replies.length > 0 && !showReplies && (
				<Pressable
					onPress={() => setShowReplies(true)}
					style={{
						backgroundColor: '#EDEDED',
						borderRadius: 3,
						paddingVertical: 3,
						alignItems: 'center',
					}}>
					<Text
						style={{
							fontSize: 12,
							letterSpacing: 0.5,
							fontWeight: '500',
							color: '#545454',
						}}>
						Show Replies
					</Text>
				</Pressable>
			)}

			{/* Nested Replies */}
			{showReplies && (
				<FlatList
					data={replies}
					keyExtractor={(reply) => reply.id}
					renderItem={({item}) => (
						<CommentListItem
							comment={item}
							depth={depth + 1}
							handleReplyPress={handleReplyPress}
						/>
					)}
				/>
			)}
		</View>
	);
};

export default memo(CommentListItem);
