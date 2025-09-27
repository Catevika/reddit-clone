import {insertPost} from '@/services/postService';
import {selectedGroupAtom} from '@/src/atoms';
import {useAuth, useUser} from '@clerk/clerk-expo';
import {AntDesign} from '@expo/vector-icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Link, router} from 'expo-router';
import {useAtom} from 'jotai';
import {useState} from 'react';
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CreateScreen() {
	const {getToken} = useAuth();

	const {user} = useUser();
	if (!user) throw new Error('User not found');

	const [title, setTitle] = useState<string>('');
	const [bodyText, setBodyText] = useState<string>('');

	const [group, setGroup] = useAtom(selectedGroupAtom);

	const queryClient = useQueryClient();

	const goBack = () => {
		setTitle('');
		setBodyText('');
		setGroup(null);
		router.back();
	};

	const {mutate: createPost, isPending} = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error('No token found');

			if (!group) {
				throw new Error('Please select a community');
			}

			if (!title) {
				throw new Error('Please enter a title');
			}

			const result = await insertPost(token, {
				title,
				description: bodyText,
				group_id: group.id,
				user_id: user.id,
				nb_comments: null,
			});
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['posts']});
			goBack();
		},
		onError: (error) => {
			console.log(error);
			Alert.alert('Failed to create new Post', error.message);
		},
	});

	return (
		<SafeAreaView
			style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
			{/* HEADER */}
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<AntDesign
					name='close'
					size={30}
					color='black'
					onPress={() => goBack()}
				/>
				<Pressable
					onPress={() => createPost()}
					disabled={isPending}
					style={{marginLeft: 'auto'}}>
					<Text style={styles.postText}>
						{isPending ? 'Posting...' : 'Post'}
					</Text>
				</Pressable>
			</View>
			{/* COMMUNITY SELECTOR */}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{flex: 1}}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Link
						href={'/groupSelector'}
						asChild>
						<Pressable style={styles.communityContainer}>
							{group && group.image ? (
								<>
									<Image
										source={{uri: group.image}}
										width={20}
										height={20}
										borderRadius={10}
									/>
									<Text style={{fontWeight: 600}}>{group.name}</Text>
								</>
							) : (
								<>
									<Text style={styles.rStyle}>/r</Text>
									<Text style={{fontWeight: 600}}>Select a community</Text>
								</>
							)}
						</Pressable>
					</Link>
					{/* INPUTS */}
					<TextInput
						value={title}
						placeholder='Title'
						onChangeText={setTitle}
						multiline
						scrollEnabled={false}
						style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 20}}
					/>
					<TextInput
						value={bodyText}
						multiline
						scrollEnabled={false}
						placeholder='BodyText text (optional)'
						onChangeText={setBodyText}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	postText: {
		backgroundColor: '#0d469b',
		color: 'white',
		fontWeight: 'bold',
		paddingVertical: 2,
		paddingHorizontal: 7,
		borderRadius: 10,
	},
	rStyle: {
		backgroundColor: 'black',
		color: 'white',
		paddingVertical: 1,
		paddingHorizontal: 5,
		borderRadius: 10,
		fontWeight: 'bold',
	},
	communityContainer: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		backgroundColor: '#EDEDED',
		padding: 10,
		borderRadius: 20,
		gap: 5,
		marginVertical: 10,
	},
});
