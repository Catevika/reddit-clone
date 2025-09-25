import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

type InsertUpvote = TablesInsert<'upvotes'>;
type Upvote = Tables<'upvotes'>;

export const createUpvote = async (
	user_id: string,
	post_id: string,
	value: 1 | -1,
	token: string,
): Promise<InsertUpvote> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('upvotes')
		.upsert({user_id, post_id, value}, {onConflict: 'user_id, post_id'})
		.select()
		.single();

	if (error) {
		throw error;
	}
	return data;
};

export const selectMyVote = async (
	user_id: string,
	post_id: string,
	token: string,
): Promise<Upvote> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('upvotes')
		.select('*')
		.eq('user_id', user_id)
		.eq('post_id', post_id)
		.single();

	if (error) {
		throw error;
	}
	return data;
};

export const deleteMyUpvote = async (
	token: string,
	user_id: string,
	post_id: string,
) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('upvotes')
		.delete()
		.eq('user_id', user_id)
		.eq('post_id', post_id);
	if (error) throw error;
	return data;
};
