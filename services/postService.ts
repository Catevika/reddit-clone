import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

type Post = Tables<'posts'> & {
	user: Tables<'users'>;
	group: Tables<'groups'>;
	totalUpvotes: {sum: number}[];
	upvote: Tables<'upvotes'>;
	nb_comments: {count: number}[] | null;
};

type InsertPost = TablesInsert<'posts'>;

export const fetchPosts = async (token: string | null) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('posts')
		.select(
			'*, group:groups(*), upvotes(value.sum()), nb_comments:comments(count)',
		)
		.order('created_at', {ascending: false});

	if (error) throw error;
	return data;
};

export const fetchPostById = async (
	token: string | null,
	id: string,
): Promise<Post> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('posts')
		.select(
			'*, group:groups(*), upvotes(value.sum()), nb_comments:comments(count)',
		)
		.eq('id', id)
		.single();

	if (!data || error) throw error;
	return data;
};

export const insertPost = async (
	token: string | null,
	post: InsertPost & {nb_comments: null},
): Promise<InsertPost & {nb_comments: null}> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('posts')
		.insert(post)
		.select()
		.single();

	if (error || !data) throw error;
	return data;
};

export const deletePostById = async (token: string | null, id: string) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase.from('posts').delete().eq('id', id);
	if (error) throw error;
	return data;
};

export const fetchPostUpvotes = async (
	token: string | null,
	post_id: string,
) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('upvotes')
		.select('sum_value: value.sum()')
		.eq('post_id', post_id);
	if (error) throw error;
	return data;
};
