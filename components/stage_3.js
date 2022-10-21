import HCaptcha from '@hcaptcha/react-hcaptcha';
import Head from 'next/head'
import axios from 'axios';
import { useRouter } from "next/router"
import { useState, useEffect } from 'react'


export default function Stage_3(props) {
    const [counter, setCounter] = useState(parseInt(process.env.NEXT_PUBLIC_STAGE_3_TIMER))
    const router = useRouter();
    const [notFound, setNotFound] = useState(false);
    const [success, setSuccess] = useState(false);
    const [coinsGot, setCoinsGot] = useState(0)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter])

    const handleVerificationSuccess = async (token, ekey) => {
        setLoading(true)
        // console.log(token, ekey)
        let response;
        try {
            response = await axios.post('/api/stages/3', {
                "username": props.username,
                "tag": props.tag
            }, {
                headers: {
                    "token": token
                }
            })
        } catch (error) {
            setLoading(false)
            if (error && error.response && error.response.status && error.response.status === 404) {
                return setNotFound(true)
            }
            return router.replace("/")
        }

        const stat = await response.data && response.data.status
        setLoading(false)
        if (stat != "done") return router.replace("/")

        //here the coins are set
        setCoinsGot(response.data.coins)
        setSuccess(true)
    }

    if (loading) {
        return (
            <>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_STAGE_3_TITLE}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <div class="text-center">
                        <div role="status">
                            <svg class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (notFound) {
        return (
            <>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_STAGE_3_TITLE}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col ">
                    <p className="p-2 pt-5 pb-5 text-xl ">Sadly, Your did not got any coins. </p>
                    <p className="text-white pb-5">The id {props.username}, was not found on the server.</p>

                </div>
            </>
        )
    }

    if (success) {
        return (
            <>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_STAGE_3_TITLE}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col ">
                    <p className="p-2 pt-5 pb-5 text-xl ">Congrats, {props.username}</p>
                    <p className="text-white pb-5">You got {coinsGot} coins in your wallet.</p>

                </div>
            </>
        )
    }



    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_STAGE_3_TITLE}</title>
            </Head>
            <div className="flex justify-center h-screen w-screen items-center flex-col ">
                <p className="p-2 pt-5 pb-5 text-xl ">Congo, you have made it till here. You are currently at the Final Stage of Your way.</p>
                <p className="text-white pb-5">Now you just jave to fill the captcha and and get your money.</p>

                {
                    counter != 0 ? (
                        <p className="text-white text-2xl font-bold">{counter}</p>

                    ) : (
                        <HCaptcha
                            sitekey={process.env.NEXT_PUBLIC_H_SITEKEY}
                            onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                        />

                    )
                }

            </div>
        </>
    )
}