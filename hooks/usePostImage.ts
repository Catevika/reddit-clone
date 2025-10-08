import {downloadImage} from '@/utils/supabaseImages';
import {useAuth} from '@clerk/clerk-expo';
import {useQuery} from '@tanstack/react-query';

const BUCKET = process.env.EXPO_PUBLIC_SUPABASE_BUCKET;
if (!BUCKET) throw new Error('No storage bucket found');

export const usePostImage = (imageFileName: string | null) => {
	const {getToken} = useAuth();

	return useQuery({
		queryKey: ['image', imageFileName],
		queryFn: async () => {
			if (!imageFileName) return null;
			const token = await getToken();
			if (!token) throw new Error('No token found');
			return downloadImage(BUCKET, imageFileName, token);
		},
		enabled: !!imageFileName,
		staleTime: 1000 * 60 * 30,
	});
};
