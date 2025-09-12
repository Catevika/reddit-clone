import {useAuth} from '@clerk/clerk-expo';
import {Entypo, Feather, MaterialIcons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {router, Stack} from 'expo-router';
import {ActivityIndicator, View} from 'react-native';

export default function AppLayout() {
	const {isLoaded, isSignedIn} = useAuth();

	if (!isLoaded) {
		return <ActivityIndicator />;
	}

	return (
		<Stack>
			<Stack.Protected guard={isSignedIn}>
				<Stack.Screen
					name='(tabs)'
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name='groupSelector'
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name='post/[id]'
					options={{
						headerTitle: '',
						headerStyle: {backgroundColor: '#FF5700'},
						headerLeft: () => (
							<AntDesign
								name='close'
								size={24}
								color='white'
								onPress={() => router.back()}
							/>
						),
						headerRight: () => (
							<View style={{flexDirection: 'row', gap: 10}}>
								<Feather
									name='search'
									size={24}
									color='white'
								/>
								<MaterialIcons
									name='sort'
									size={27}
									color='white'
								/>
								<Entypo
									name='dots-three-horizontal'
									size={24}
									color='white'
								/>
							</View>
						),
						animation: 'slide_from_bottom',
					}}
				/>
			</Stack.Protected>
		</Stack>
	);
}
