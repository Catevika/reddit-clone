import {usePostImage} from '@/hooks/usePostImage';
import {type ComponentProps} from 'react';
import {Image, View} from 'react-native';

type PostImageProps = {
	imageFileName: string | null;
} & ComponentProps<typeof Image>;

export default function PostImage({
	imageFileName,
	...imageProps
}: PostImageProps) {
	const {data: signedImageUri, isLoading, error} = usePostImage(imageFileName);

	if (isLoading || !signedImageUri) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: 'gainsboro',
					alignItems: 'center',
					justifyContent: 'center',
					aspectRatio: 4 / 3,
					borderRadius: 15,
				}}></View>
		);
	}

	if (error) return null;

	return (
		<Image
			source={{uri: signedImageUri}}
			{...imageProps}
		/>
	);
}
