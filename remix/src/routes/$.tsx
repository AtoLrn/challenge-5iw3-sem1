import {  Link, MetaFunction } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { useTranslation } from 'react-i18next';

export const meta: MetaFunction = () => {
	return [{
		title: 'Page not found'
	}]
}

export function ErrorBoundary() {
	const { t } = useTranslation();
	return <main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>
		<div className='z-20 flex flex-col items-center align-middle'>
			<Title kind="h1" className='z-20 pb-20'>{t('Huho...')}</Title>
			<Title kind="h2" className='z-20 pb-10'>{t('Looks like you found an error. No worries, we are reporting errors')}.</Title>
			<Link to='/'>{t('Home page')}</Link>
		</div>

		<div className='absolute top-0 left-1/2 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '-50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
		<div className='absolute top-0 left-0 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(189deg) saturate(661%) contrast(150%)'}}>
			<img className='w-screen h-screen object-cover z-0' src="https://media.gqmagazine.fr/photos/5eec960683548f5bbff4e690/16:9/w_2560%2Cc_limit/GettyImages-1004929286-Tatuajes.jpg" alt="" />
		</div>
	</main>
}
  

export default function NotFoundPage () {
	const { t } = useTranslation();
	return <main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>
		<div className='z-20 flex flex-col items-center align-middle'>
			<Title kind="h1" className='z-20 pb-20'>{t('Page not found ;(')}</Title>
			<Title kind="h2" className='z-20 pb-10'>{t('You might have navigated to an unknown or an old page')}</Title>
			<Link to='/'>{t('Homepage')}</Link>
		</div>

		<div className='absolute top-0 left-1/2 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '-50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
		<div className='absolute top-0 left-0 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(189deg) saturate(661%) contrast(150%)'}}>
			<img className='w-screen h-screen object-cover z-0' src="https://media.gqmagazine.fr/photos/5eec960683548f5bbff4e690/16:9/w_2560%2Cc_limit/GettyImages-1004929286-Tatuajes.jpg" alt="" />
		</div>
	</main>
}