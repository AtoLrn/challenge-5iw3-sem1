import { Link } from '@remix-run/react'
import React from 'react'

export interface BreadCrumbProps {
    routes: {
        name: string,
        url: string
    }[]
}

export const BreadCrumb: React.FC<BreadCrumbProps> = ({ routes }) => {
	return <div className="flex items-center gap-2 justify-start">
		{ routes.map((route, index) => {
			return <span className='flex items-center gap-2' key={route.url}><Link to={route.url}><span>{route.name}</span></Link>{ index !== routes.length - 1 && <span>/</span>}</span>
		}) }
	</div>
}