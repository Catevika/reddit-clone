import groups from '@/assets/data/groups.json';
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {useState} from 'react';
import {
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function groupSelector() {
	const [searchValue, setSearchValue] = useState<string>('');

	const filteredGroups = groups.filter((group) =>
		group.name.toLowerCase().includes(searchValue.toLowerCase()),
	);

	return (
		<SafeAreaView style={{marginHorizontal: 10, flex: 1}}>
			{/* HEADER */}
			<View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
				<AntDesign
					name='close'
					size={30}
					color='black'
					onPress={() => router.back()}
				/>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						textAlign: 'center',
						flex: 1,
						paddingRight: 30,
					}}>
					Post to
				</Text>
			</View>
			{/* SEARCH BAR */}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{flex: 1}}>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: 'lightgrey',
						borderRadius: 5,
						gap: 5,
						marginVertical: 10,
						alignItems: 'center',
						paddingHorizontal: 5,
					}}>
					<Feather
						name='search'
						size={20}
						color='gray'
					/>
					<TextInput
						value={searchValue}
						placeholder='Search for a community'
						placeholderTextColor='grey'
						onChangeText={setSearchValue}
						style={{paddingVertical: 10, flex: 1}}
					/>
					{searchValue && (
						<Ionicons
							name='close-circle'
							size={24}
							color='#E4E4E4'
							onPress={() => setSearchValue('')}
						/>
					)}
				</View>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={filteredGroups}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<Pressable
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 5,
								marginBottom: 10,
								borderRadius: 20,
							}}>
							<Image
								source={{uri: item.image}}
								style={{width: 40, aspectRatio: 1, borderRadius: 20}}
							/>
							<Text style={{fontWeight: 600}}>{item.name}</Text>
						</Pressable>
					)}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
