import {ClerkProvider} from '@clerk/clerk-expo';
import {tokenCache} from '@clerk/clerk-expo/token-cache';
import {useReactQueryDevTools} from '@dev-plugins/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Slot} from 'expo-router';

const queryClient = new QueryClient();

export default function _RootLayout() {
	useReactQueryDevTools(queryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<ClerkProvider
				tokenCache={tokenCache}
				telemetry={false}>
				<Slot />
			</ClerkProvider>
		</QueryClientProvider>
	);
}
