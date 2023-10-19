export const getEnvironnement = () => {
	return {
		GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID ?? '',
		NODE_ENV: process.env.NODE_ENV 
	}
}