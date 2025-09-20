import {selectedGroupAtom} from '@/src/atoms';
import {fetchGroups} from '@/src/services/groupService';
import type {Tables} from '@/types/database.types';
import {Feather, Ionicons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {useQuery} from '@tanstack/react-query';
import {router} from 'expo-router';
import {useSetAtom} from 'jotai';
import {useState} from 'react';
import {
	ActivityIndicator,
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

type Group = Tables<'groups'>;

export default function GroupSelector() {
	const [searchValue, setSearchValue] = useState<string>('');
	const setGroup = useSetAtom(selectedGroupAtom);

	const {
		data: filteredGroups,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['groups', {searchValue}],
		queryFn: () => fetchGroups(searchValue),
		placeholderData: (previousData) => previousData,
	});

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error || !filteredGroups) {
		console.log(error);
		return <Text>Group not found</Text>;
	}

	const onGroupSelected = (group: Group) => {
		setGroup(group);
		router.back();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
			<SafeAreaView style={{flex: 1}}>
				{/* HEADER */}
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<AntDesign
						name='close'
						size={30}
						color='black'
						onPress={() => router.back()}
					/>
					<Text
						style={{
							flex: 1,
							textAlign: 'center',
							paddingRight: 30,
							fontWeight: '600',
							fontSize: 15,
						}}>
						Post to
					</Text>
				</View>
				{/* SEARCH BAR */}
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
						placeholderTextColor={'gray'}
						style={{paddingVertical: 10, flex: 1}}
						onChangeText={(text) => setSearchValue(text)}
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
				{/* LIST OF GROUPS */}
				<FlatList
					style={{marginTop: 10}}
					data={filteredGroups}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<Pressable
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 5,
								marginBottom: 20,
							}}
							onPress={() => onGroupSelected(item)}>
							{item && item.image && (
								<Image
									source={{uri: item.image}}
									style={{width: 40, aspectRatio: 1, borderRadius: 20}}
								/>
							)}
							<View>
								<Text style={{fontWeight: '600'}}>{item.name}</Text>
								<Text style={{color: 'grey'}}>recently visited</Text>
							</View>
						</Pressable>
					)}
				/>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
