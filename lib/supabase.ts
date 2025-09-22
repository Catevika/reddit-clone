import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
	process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function createSupabaseClientWithToken(token: string | null) {
	return createClient(supabaseUrl, supabasePublishableKey, {
		global: {
			headers: {
				...(token ? {Authorization: `Bearer ${token}`} : {}),
			},
		},
	});
}
