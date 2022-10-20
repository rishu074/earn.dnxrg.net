import HCaptcha from '@hcaptcha/react-hcaptcha';
import Head from 'next/head'
import axios from 'axios';
import { useRouter } from "next/router"
import { useState, useEffect } from 'react'


export default function Stage_1(props) {
    const [counter, setCounter] = useState(parseInt(process.env.NEXT_PUBLIC_STAGE_2_TIMER))
    const router = useRouter();

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter])

    const handleVerificationSuccess = async (token, ekey) => {
        console.log(token, ekey)
    }



    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_STAGE_2_TITLE}</title>
            </Head>
            <div className="flex justify-center h-screen w-screen items-center flex-col ">
                <p className="p-2 pt-5 pb-5 text-xl ">Congo, you have made it till here. You are currently at the Stage-2 of Your way.</p>
                <p className="text-white pb-5">Now you just jave to fill the captcha and move-on to your next step.</p>

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