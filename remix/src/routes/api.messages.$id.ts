import { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()

    const {id} = params

    if (!id) {
        return new Response(undefined, { status: 404 })
    }

    const url = new URL(`${process.env.API_URL}/.well-known/mercure`)
    url.searchParams.append('topic', `/messages/channel/${id}`)

    const response = await fetch(url.href)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
        return new Response(undefined, { status: 404 })
    }

    // Send Keep Alive Message
    const interval = setInterval(() => {
        writer.write(encoder.encode(':keepalive\n\n'))
    }, 5_000)

    new Promise<void>(async (resolve, _) => {
        while (true) {
            const { value, done } = await reader.read();
            
            if (done) break;
            const data = decoder.decode(value)
            const parsed = data.split('data: ')['1']
            if(parsed) {
                await writer.write(encoder.encode('data: ' + JSON.stringify(JSON.parse(parsed)) + '\n\n'))
            }
        }
        resolve()
    }).then(() => clearInterval(interval))

    //reader.subscribe(async (e) => {
        //console.log(JSON.parse(e.data))
        //await writer.write(encoder.encode('data: ' + JSON.stringify(e) + '\n\n'))
    //}).add(() => {
        //clearInterval(interval)
        //writer.close()
    //})
    
    return new Response(responseStream.readable, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no',
            'Content-Encoding': 'none',
        },
    })
}
