import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables} from '@/types/database.types';

type Group = Tables<'groups'>;

export const fetchGroups = async (
	token: string | null,
	search: string,
): Promise<Group[]> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('groups')
		.select('*')
		.ilike('name', `%${search}%`);

	if (error) throw error;
	return data;
};
