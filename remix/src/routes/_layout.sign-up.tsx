import { Title } from 'src/components/Title'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { t } from 'i18next'
import { z } from 'zod'
import { zx } from 'zodix'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useState } from 'react'
import { register } from 'src/utils/requests/register'

const schema = z.object({
	username: z.string().min(1),
	email: z.string().min(1),
	password: z.string().min(1),
	isProfessional: zx.CheckboxAsString
}) 

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')
    console.log("lucas: ", error)
    console.log("lucas2: ", success)

	return json({
		errors: [error],
		success: success
	})
}


export const action = async ({ request }: ActionFunctionArgs) => {
	try {
        const { isProfessional } = await zx.parseForm(request, schema)

        const formData = await request.formData()

        formData.set("isProfessional", isProfessional.toString())
        formData.delete("passwordConfirm")

        await register(formData)

		return redirect(`/sign-up?success=true`)
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/sign-up?error=${e.message}`)

		return redirect(`/sign-up?error=${'Unexpected Error'}`)
	}

}

export default function MainPage() {
	const { errors, success } = useLoaderData<typeof loader>()
	const navigation = useNavigation()
	
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')
    const [ showFileButton, setShowFileButton ] = useState(false)

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowFileButton(event.target.checked)
    }

	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
						{t('sign-up')}
					</Title>
					{/* /PAGE TITLE */}

					{ errors.map((error) => {
						return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
							{error}
						</div>
					})}
                    {success ?
						<div className='mb-16 font-bold text-green-600 border-b border-white self-start'>
                            You're account has been successfully created, an email has been sent to verify your account
						</div> : null
                    }

					{/* REGISTER FORM */}
					<Form method='POST' encType="multipart/form-data" className="flex flex-col">
						<Title kind="h4" className="z-20 pb-4">
							{t('identity')}
						</Title>
						<div className="flex flex-row gap-4 mb-8">
							<input type="text" name="username" placeholder="Username" className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<Title kind="h4" className="z-20 pb-4 pt-2">
							{t('account')}
						</Title>
						<div className="flex flex-row gap-4 mb-8">
							<input type="email" name="email" placeholder="Email Address" className="w-full bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<div className="flex flex-row gap-4 mb-10">
							<input value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password" name="password" placeholder="Password" className="w-1/2 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
							<input value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.currentTarget.value)} type="password" name="passwordConfirm" placeholder="Confirm Password" className="w-1/2 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						{ password !== passwordConfirmation && 
						
						<div className="flex flex-row gap-4 mb-10 font-bold text-red-600 border-b border-white self-start">
							{t('no-match')}
						</div>
						}
						
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<input id="isProfessional" type="checkbox" name="isProfessional" className="checkBox cursor-pointer" onChange={handleCheck}/>
							<label htmlFor="isProfessional" className="cursor-pointer">I am a tattoo artist</label>
						</div>
						{showFileButton && <div className="flex flex-row gap-3 mb-4 items-center">
							<input id="kbisFile" type="file" required name="kbisFile" className="cursor-pointer" accept="image/png, image/jpeg, application/pdf"/>
							<label htmlFor="kbisFile" className="cursor-pointer">KBIS File</label>
						</div>}
						<div className="flex items-center justify-between">
							<button disabled={password !== passwordConfirmation || navigation.state === 'submitting'} type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
								{navigation.state === 'submitting' ? t('loading') : t('create-your-account')}
							</button>

							<Link className="inline-block align-baseline font-bold text-sm text-gray-300 hover:text-white transition-all" to='/login'>
								{t('already-have-an-account')}
							</Link>
						</div>
					</Form>
					{/* /REGISTER FORM */}
				</div>

				<div className="hidden sm:w-full"></div>

			</div>

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg" alt="sign-up background" />
			</div>

			<style>
				{`
                    input[type=checkbox] {
                        position: relative;
                        border: 2px solid white;
                        background: none;
                        outline: 0;
                        height: 20px;
                        width: 20px;
                        -webkit-appearance: none;
                    }
                    
                    input[type=checkbox]:checked {
                        background-color: white;
                    }
                    
                    input[type=checkbox]:checked:before {
                        content: '';
                        position: absolute;
                        right: 50%;
                        top: 50%;
                        width: 4px;
                        height: 10px;
                        border: solid #000;
                        border-width: 0 2px 2px 0;
                        margin: -1px 0 0 -1px;
                        transform: rotate(45deg) translate(-50%, -50%);
                        z-index: 2;
                    }
                `}
			</style>
		</main>
	)
}

