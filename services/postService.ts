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

export const fetchPosts = async (
	offset: number,
	limit: number,
	token: string,
): Promise<{data: Post[]; hasMore: boolean}> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error, count} = await supabase
		.from('posts')
		.select(
			'*, group:groups(*), upvotes(value.sum()), nb_comments:comments(count)',
			{count: 'exact'},
		)
		.order('created_at', {ascending: false})
		.range(offset, offset + limit - 1);

	if (error) throw error;

	const hasMore = count !== null && offset + limit < count;

	return {
		data: data ?? [],
		hasMore,
	};
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
