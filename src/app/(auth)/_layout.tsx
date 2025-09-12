import {useAuth} from '@clerk/clerk-expo';
import {Redirect, Stack} from 'expo-router';
import {ActivityIndicator} from 'react-native';

export default function AuthLayout() {
	const {isLoaded, isSignedIn} = useAuth();

	if (!isLoaded) {
		return <ActivityIndicator />;
	}

	if (isSignedIn) {
		return <Redirect href='/' />;
	}

	return (
		<Stack screenOptions={{headerBackButtonDisplayMode: 'minimal'}}>
			<Stack.Screen
				name='sign-in'
				options={{title: 'Sign In'}}
			/>
			<Stack.Screen
				name='sign-up'
				options={{title: 'Sign Up'}}
			/>
		</Stack>
	);
}
