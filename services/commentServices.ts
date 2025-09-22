import {createSupabaseClientWithToken} from '@/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

type Comment = Tables<'comments'> & {
	user: Tables<'users'>;
	posts: Tables<'posts'>;
};

type InsertComment = TablesInsert<'comments'>;

export const fetchComments = async (token: string | null) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase.from('comments').select('*');

	if (error) throw error;
	return data;
};

// export const fetchCommentById = async (
// 	token: string | null,
// 	id: string,
// ): Promise<Comment> => {
// 	const supabase = createSupabaseClientWithToken(token);

// 	const {data, error} = await supabase
// 		.from('comments')
// 		.select('*')
// 		.eq('id', id)
// 		.single();

// 	if (!data || error) throw error;
// 	return data;
// };

// export const insertComment = async (
// 	token: string | null,
// 	comment: InsertComment,
// ): Promise<InsertComment> => {
// 	const supabase = createSupabaseClientWithToken(token);

// 	const {data, error} = await supabase
// 		.from('comments')
// 		.insert(comment)
// 		.select()
// 		.single();

// 	if (error || !data) throw error;
// 	return data;
// };

// export const deleteCommentById = async (token: string | null, id: string) => {
// 	const supabase = createSupabaseClientWithToken(token);

// 	const {data, error} = await supabase.from('comments').delete().eq('id', id);
// 	if (error) throw error;
// 	return data;
// };
