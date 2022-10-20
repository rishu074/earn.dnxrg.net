import HCaptcha from '@hcaptcha/react-hcaptcha';
import Head from 'next/head'
import axios from 'axios';
import { useRouter } from "next/router"
import { useState, useEffect } from 'react'


export default function Stage_1(props) {
    const [timer, setTimer] = useState(parseInt(process.env.NEXT_PUBLIC_STAGE_2_TIMER))
    const router = useRouter();

    useEffect(() => {
        var timerIntervel = setInterval(() => {
            setTimer(timer-1)
        }, 1000)

        setTimeout(() => {
            clearInterval(timerIntervel)
        }, parseInt(process.env.NEXT_PUBLIC_STAGE_2_TIMER)*1000)
    }, [timer])

    const handleVerificationSuccess = async (token, ekey) => {
        console.log(token, ekey)
    }

    var timerIntervel = setInterval(() => {
        console.log(1)
    }, 1000)

    setTimeout(() => {
        clearInterval(timerIntervel)
    }, parseInt(process.env.NEXT_PUBLIC_STAGE_2_TIMER)*1000)



    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_STAGE_2_TITLE}</title>
            </Head>
            <div className="flex justify-center h-screen w-screen items-center flex-col ">
                <p className="text-white text-2xl font-bold">{timer}</p>
                <p className="p-2 pt-5 pb-5 text-xl ">Congo, you have made it till here. You are currently at the Stage-1 of Your way.</p>
                <p className="text-white pb-5">Now you just jave to fill the captcha and move-on to your next step.</p>

                <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_H_SITEKEY}
                    onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                />
            </div>
        </>
    )
}