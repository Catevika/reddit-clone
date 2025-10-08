import {insertPost} from '@/services/postService';
import {selectedGroupAtom} from '@/src/atoms';
import {uploadImage} from '@/utils/supabaseImages';
import {useAuth, useUser} from '@clerk/clerk-expo';
import {AntDesign, Feather} from '@expo/vector-icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
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

const BUCKET = process.env.EXPO_PUBLIC_SUPABASE_BUCKET;
if (!BUCKET) throw new Error('No storage bucket found');

export default function CreateScreen() {
	const {getToken} = useAuth();

	const {user} = useUser();
	if (!user) throw new Error('User not found');

	const [title, setTitle] = useState<string>('');
	const [bodyText, setBodyText] = useState<string>('');
	const [image, setImage] = useState<string | null>(null);

	const [group, setGroup] = useAtom(selectedGroupAtom);

	const queryClient = useQueryClient();

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const goBack = () => {
		setTitle('');
		setBodyText('');
		setGroup(null);
		setImage(null);
		router.back();
	};

	const {mutate: createPost, isPending} = useMutation({
		mutationFn: async (fileName: string | undefined) => {
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
				image: fileName,
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

	const createPostWithImage = async () => {
		const token = await getToken();
		if (!token) throw new Error('No token found');

		const fileName =
			BUCKET && image
				? await uploadImage(BUCKET, image, user.id, token)
				: undefined;

		createPost(fileName);
	};

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
					onPress={() => createPostWithImage()}
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
					{image && (
						<View style={{paddingBottom: 20}}>
							<AntDesign
								name='close'
								size={25}
								color='white'
								onPress={() => setImage(null)}
								style={{
									position: 'absolute',
									zIndex: 1,
									right: 10,
									top: 10,
									padding: 5,
									backgroundColor: '#00000090',
									borderRadius: 20,
								}}
							/>
							<Image
								source={{uri: image}}
								style={{width: '100%', aspectRatio: 1}}
							/>
						</View>
					)}
					<TextInput
						value={bodyText}
						multiline
						scrollEnabled={false}
						placeholder='BodyText text (optional)'
						onChangeText={setBodyText}
					/>
				</ScrollView>
				{/* FOOTER */}
				<View style={{flexDirection: 'row', gap: 20, padding: 10}}>
					<Feather
						name='link'
						size={20}
						color='black'
					/>
					<Feather
						name='image'
						size={20}
						color='black'
						onPress={pickImage}
					/>
					<Feather
						name='youtube'
						size={20}
						color='black'
					/>
					<Feather
						name='list'
						size={20}
						color='black'
					/>
				</View>
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
