import {useClerk} from '@clerk/clerk-expo';
import {Feather} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {TouchableOpacity} from 'react-native';

export default function SignOutButton() {
	// Use `useClerk()` to access the `signOut()` function
	const {signOut} = useClerk();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await signOut();
			// Redirect to your desired page
			router.replace('/sign-in');
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<TouchableOpacity onPress={handleSignOut}>
			<Feather
				name='log-out'
				size={22}
				color='black'
				style={{paddingRight: 10}}
			/>
		</TouchableOpacity>
	);
}
