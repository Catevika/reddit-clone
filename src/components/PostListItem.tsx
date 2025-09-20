import type {Tables} from '@/types/database.types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {formatDistanceToNowStrict} from 'date-fns';
import {Link} from 'expo-router';
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

type Post = Tables<'posts'> & {
	user: Tables<'users'>;
	group: Tables<'groups'>;
};

type PostListItemProps = {
	post: Post;
	isDetailedPost?: boolean;
};

export default function PostListItem({
	post,
	isDetailedPost,
}: PostListItemProps) {
	const shouldShowImage = isDetailedPost || post.image;
	const shouldShowDescription = isDetailedPost || !post.image;

	return (
		<ScrollView>
			<Link
				href={`/post/${post.id}`}
				asChild>
				<Pressable
					style={{
						paddingHorizontal: 15,
						paddingVertical: 10,
						gap: 7,
						borderBottomColor: 'lightgrey',
						borderBottomWidth: 0.5,
						backgroundColor: 'white',
					}}>
					{/* HEADER */}
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						{post.group && post.group.image ? (
							<Image
								source={{uri: post.group.image}}
								style={{
									width: 30,
									height: 30,
									borderRadius: 40,
									marginRight: 5,
								}}
							/>
						) : null}
						<View>
							<View style={{flexDirection: 'row', gap: 5}}>
								<View style={{flexDirection: 'column'}}>
									<Text
										style={{
											fontWeight: 'bold',
											fontSize: 13,
											color: '#3A3B3C',
										}}>
										{post.group.name}
									</Text>
									<Text
										style={{
											color: 'grey',
											fontSize: 13,
											alignSelf: 'flex-start',
										}}>
										{formatDistanceToNowStrict(new Date(post.created_at!))}
									</Text>
								</View>
							</View>
							{isDetailedPost && (
								<Text style={{fontSize: 13, color: '#2E5DAA'}}>
									{post.user?.name}
								</Text>
							)}
						</View>
						<Pressable
							onPress={() => console.error('Pressed')}
							style={{
								marginLeft: 'auto',
								backgroundColor: '#0d469b',
								borderRadius: 10,
							}}>
							<Text
								style={{
									color: 'white',
									paddingVertical: 4,
									paddingHorizontal: 9,
									fontWeight: 'bold',
									fontSize: 13,
								}}>
								Join
							</Text>
						</Pressable>
					</View>

					{/* CONTENT */}
					<Text style={{fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5}}>
						{post.title}
					</Text>
					{shouldShowImage && post.image && (
						<Image
							source={{uri: post.image}}
							style={{width: '100%', aspectRatio: 4 / 3, borderRadius: 15}}
						/>
					)}

					{shouldShowDescription && post.description && (
						<Text numberOfLines={isDetailedPost ? undefined : 4}>
							{post.description}
						</Text>
					)}

					{/* FOOTER */}
					<View style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'row', gap: 10}}>
							<View style={[{flexDirection: 'row'}, styles.iconBox]}>
								<MaterialCommunityIcons
									name='arrow-up-bold-outline'
									size={19}
									color='black'
								/>
								{/* <Text
									style={{
										fontWeight: '500',
										marginLeft: 5,
										alignSelf: 'center',
									}}>
									{post.upvotes}
								</Text> */}
								<View
									style={{
										width: 1,
										backgroundColor: '#D4D4D4',
										height: 14,
										marginHorizontal: 7,
										alignSelf: 'center',
									}}
								/>
								<MaterialCommunityIcons
									name='arrow-down-bold-outline'
									size={19}
									color='black'
								/>
							</View>
							<View style={[{flexDirection: 'row'}, styles.iconBox]}>
								<MaterialCommunityIcons
									name='comment-outline'
									size={19}
									color='black'
								/>
								{/* <Text
									style={{
										fontWeight: '500',
										marginLeft: 5,
										alignSelf: 'center',
									}}>
									{post.nr_of_comments}
								</Text> */}
							</View>
						</View>
						<View style={{marginLeft: 'auto', flexDirection: 'row', gap: 10}}>
							<MaterialCommunityIcons
								name='trophy-outline'
								size={19}
								color='black'
								style={styles.iconUp}
							/>
							<MaterialCommunityIcons
								name='share-outline'
								size={19}
								color='black'
								style={styles.iconUp}
							/>
						</View>
					</View>
				</Pressable>
			</Link>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	iconBox: {
		display: 'flex',
		alignItems: 'center',
		borderWidth: 0.5,
		borderColor: '#D4D4D4',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
	},
	iconUp: {
		display: 'flex',
		alignItems: 'center',
		borderWidth: 0.5,
		borderColor: '#D4D4D4',
		paddingHorizontal: 10,
		paddingTop: 8,
		paddingBottom: 5,
		borderRadius: 20,
	},
});
