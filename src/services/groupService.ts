import {supabase} from '@/src/lib/supabase';
import type {Tables} from '@/types/database.types';

type Group = Tables<'groups'>;

export const fetchGroups = async (search: string): Promise<Group[]> => {
	const {data, error} = await supabase
		.from('groups')
		.select('*')
		.ilike('name', `%${search}%`);

	if (error) {
		throw error;
	} else {
		return data;
	}
};
