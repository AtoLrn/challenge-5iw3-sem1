import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'

export default function ProLayout () {
	const { t } = useTranslation()

	return <div className='flex-1 flex items-center justify-center'>
		<Title kind='h1'>{t('page-not-found')}</Title>
	</div>
}
