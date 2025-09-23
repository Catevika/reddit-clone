import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

// TODO - Fix the upvotes sum that is displayed for all posts after each postId is opened
// The problem is that the queryKey is the same for all posts, so the cache is shared
// Solution: use a different queryKey for each post, e.g. ['posts', 'upvotes', post.id]

type Post = Tables<'posts'> & {
	user: Tables<'users'>;
	group: Tables<'groups'>;
	upvotes: {sum: number | null}[];
};

type InsertPost = TablesInsert<'posts'>;

export const fetchPosts = async (token: string | null) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('posts')
		.select('*, group:groups(*), upvotes(value.sum())')
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
		.select('*, group:groups(*), upvotes(value.sum())')
		.eq('id', id)
		.single();

	if (!data || error) throw error;
	return data;
};

export const insertPost = async (
	token: string | null,
	post: InsertPost,
): Promise<InsertPost> => {
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
	postId: string,
) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('upvotes')
		.select('value.sum()')
		.eq('post_id', postId);
	if (error) throw error;
	return data;
};
