import HCaptcha from '@hcaptcha/react-hcaptcha';
import Head from 'next/head'
import axios from 'axios';
import {useRouter} from "next/router"


export default function Stage_1(props) {
    const router = useRouter();

    const handleVerificationSuccess = async (token, ekey) => {
        // console.log(token, ekey)
        let response;
        try {
            response = await axios.post('/api/stages/1', {
                "username": props.username,
                "tag": props.tag
            }, {
                headers: {
                    "token": token
                }
            })
        } catch(error) {
            return router.replace("/")
        }

        const next_step = await response.data.next_step
        return router.replace(next_step)
    }


    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_STAGE_1_TITLE}</title>
            </Head>
            <div className="flex justify-center h-screen w-screen items-center flex-col ">
                <p className="text-white text-2xl font-bold">Hello, {props.username}.</p>
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