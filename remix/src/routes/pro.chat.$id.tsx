import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { z } from 'zod'
import { zx } from 'zodix'
import { t } from 'i18next'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { List } from 'src/components/Pro/List'
import { getSession } from 'src/session.server'
import { getChannel } from 'src/utils/requests/channel'
import {LoaderReturnType} from './_layout'
import { IoSend } from 'react-icons/io5'
import { RiAttachment2 } from 'react-icons/ri'
import { Message } from 'src/components/Messages/Message'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Chatting | INKIT'
		}
	]
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

    try {
        const channel = await getChannel(token, params.id as string)
        console.log(channel)

	    return json({
            channel
        })
    } catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/chat?error=${e.message}`)

		return redirect(`/pro/chat?error=${'Unexpected Error'}`)
    }
}

export default function () {
	const { channel } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Chat',
				url: '/pro/chat'
            },{
                name: channel.requestingUser.username,
                url: `/pro/chat/${channel.id}`
            }
		]}/>
            <div className="w-full h-full">

                <div className="flex flex-col h-full">
                    <div className="sticky top-0 px-4 py-6 border-b">
                        <Title kind={'h3'}>
                            {channel.requestingUser.username}
                        </Title>
                    </div>

                    {/* ========== Messages ========== */}
                    <div className="h-full overflow-y-scroll p-4 flex flex-col space-y-2">

                        {/* ========== Message (sent) ========== */}
                        <Message kind={'sent'}
                            message={'This is a sent message'}
                            date={'January 20th 2024'}
                            time={'4:20 PM'}
                        />
                        {/* ========== /Message (sent) ========== */}

                        {/* ========== Message (received) ========== */}
                        <Message kind={'received'}
                            message={'This is a received message'}
                            date={'January 20th 2024'}
                            time={'4:20 PM'}
                        />
                        {/* ========== /Message (received) ========== */}
                        
                    </div>
                    {/* ========== /Messages ========== */}

                    {/* ========== Input ========== */}
                    <Form className="flex flex-row p-4">
                        <div className="w-10/12">
                            <input name="message" type="text" className="rounded-lg p-3 bg-black text-white border border-white w-full" placeholder="Message..."/>
                        </div>
                        <div className="w-1/12 flex flex-col items-center">
                            <div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
                                <RiAttachment2 size={24}/>
                            </div>
                        </div>
                        <div className="w-1/12 flex flex-col items-center">
                            <div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
                                <IoSend size={24}/>
                            </div>
                        </div>
                    </Form>
                    {/* ========== /Input ========== */}

                </div>

            </div>
	</div>
}

