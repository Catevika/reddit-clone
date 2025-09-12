import {AntDesign} from '@expo/vector-icons';
import {router} from 'expo-router';
import {useState} from 'react';
import {
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
	const [title, setTitle] = useState<string>('');
	const [bodyText, setBodyText] = useState<string>('');

	const goBack = () => {
		setTitle('');
		setBodyText('');
		router.back();
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
					onPress={() => console.error('Pressed')}
					style={{marginLeft: 'auto'}}>
					<Text style={styles.postText}>Post</Text>
				</Pressable>
			</View>
			{/* COMMUNITY SELECTOR */}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{flex: 1}}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.communityContainer}>
						<Text style={styles.rStyle}>/r</Text>
						<Text style={{fontWeight: 600}}>Select a community</Text>
					</View>
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
