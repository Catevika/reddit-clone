import {createSupabaseClientWithToken} from '@/lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import mime from 'mime';

type ValidMime = 'image/jpeg' | 'image/png' | 'image/webp';

const VALID_MIME_TYPES: ValidMime[] = ['image/jpeg', 'image/png', 'image/webp'];

export const prepareImageForUpload = async (
	imageUri: string,
): Promise<{
	uri: string;
	contentType: ValidMime;
}> => {
	const mimeType = mime.getType(imageUri) as ValidMime | null;

	if (!mimeType || !VALID_MIME_TYPES.includes(mimeType)) {
		// Convert to JPEG using manipulateAsync
		const manipulated = await ImageManipulator.manipulateAsync(imageUri, [], {
			compress: 0.9,
			format: ImageManipulator.SaveFormat.JPEG,
		});

		return {
			uri: manipulated.uri,
			contentType: 'image/jpeg',
		};
	}

	return {
		uri: imageUri,
		contentType: mimeType,
	};
};

export const uploadImage = async (
	bucket: string,
	imageUri: string,
	userId: string,
	token: string,
) => {
	const {uri, contentType} = await prepareImageForUpload(imageUri);

	const fileExt = contentType.split('/')[1];
	const fileName = `${userId}-${Date.now()}.${fileExt}`;

	const base64 = await FileSystem.readAsStringAsync(uri, {
		encoding: 'base64',
	});

	const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

	const supabase = createSupabaseClientWithToken(token);

	const {error} = await supabase.storage
		.from(bucket)
		.upload(fileName, byteArray, {
			contentType,
			upsert: true,
		});

	if (error) throw error;
	return fileName;
};

export const downloadImage = async (
	bucket: string,
	imageFileName: string,
	token: string,
) => {
	const supabase = createSupabaseClientWithToken(token);

	const {data, error} = await supabase.storage
		.from(bucket)
		.createSignedUrl(imageFileName, 3600); // valid for 1 hour

	if (error) throw error;

	return data.signedUrl;
};
