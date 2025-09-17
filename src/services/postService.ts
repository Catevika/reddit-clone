import {supabase} from '@/src/lib/supabase';
import type {Tables, TablesInsert} from '@/types/database.types';

type Post = Tables<'posts'> & {
	user: Tables<'users'>;
	group: Tables<'groups'>;
};

type InsertPost = TablesInsert<'posts'>;

export const fetchPosts = async (): Promise<Post[]> => {
	const {data, error} = await supabase
		.from('posts')
		.select('*, group: groups(*)')
		.order('created_at', {ascending: false});
	if (error) {
		throw error;
	} else {
		return data;
	}
};

export const fetchPostById = async (id: string): Promise<Post> => {
	const {data, error} = await supabase
		.from('posts')
		.select('*, group: groups(*)')
		.eq('id', id)
		.single();

	if (error) {
		throw error;
	} else {
		return data;
	}
};

export const insertPost = async (post: InsertPost): Promise<InsertPost> => {
	const {data, error} = await supabase
		.from('posts')
		.insert(post)
		.select()
		.single();

	if (error || !data) {
		throw error;
	} else {
		return data;
	}
};
