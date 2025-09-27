import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

export type Comment = Tables<'comments'> & {
	posts: Tables<'posts'>;
	replies: Comment[];
	user: Tables<'users'>;
	upvotes: number;
};

export type InsertComment = TablesInsert<'comments'>;

export const fetchComments = async (
	post_id: string,
	token: string | null,
): Promise<Comment[]> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('comments')
		.select('*, replies:comments(*)')
		.eq('post_id', post_id)
		.is('parent_id', null);

	if (!data || error) throw error;

	return data;
};

export const fetchCommentReplies = async (
	parent_id: string,
	token: string | null,
): Promise<Comment[]> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('comments')
		.select('*, replies:comments(*)')
		.eq('parent_id', parent_id);

	if (!data || error) throw error;

	return data;
};

export const insertComment = async (
	token: string | null,
	comment: InsertComment,
): Promise<InsertComment> => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase
		.from('comments')
		.insert(comment)
		.select()
		.single();

	if (error || !data) throw error;

	return data;
};

export const deleteCommentById = async (token: string | null, id: string) => {
	const supabase = createSupabaseClientWithToken(token);

	const {error} = await supabase.from('comments').delete().eq('id', id);
	if (error) throw error;
	return true;
};
