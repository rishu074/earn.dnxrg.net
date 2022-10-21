import Head from 'next/head'
import Link from 'next/link'
import { writeToDatabase, readDatabase, checkHash, } from '../../../helpers'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
import { useRouter } from "next/router"
import { useState, useEffect } from 'react'

export default function Stage1(props) {
    const [counter, setCounter] = useState(parseInt(process.env.NEXT_PUBLIC_STAGE_3_TIMER))
    const [notFound, setNotFound] = useState(false);
    const [success, setSuccess] = useState(false);
    const [coinsGot, setCoinsGot] = useState(0)
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter])

    if (props.state && props.state === "0x1") {
        return (
            <>
                <Head>
                    <title>{process.env[`NEXT_PUBLIC_STAGE_${props.stage}_TITLE`]}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <p className="text-white text-2xl font-bold">Sorry, we can&#39;t allow you here.</p>
                    <p className="p-2 text-gray-500">There was an error while checking details.</p>
                    <p className="p-2 text-xl">In most of the cases, maybe your link is expired.</p>
                </div>

            </>
        )
    }

    if (props.state && props.state === "0x2") {
        return (
            <>
                <Head>
                    <title>{process.env[`NEXT_PUBLIC_STAGE_${props.stage}_TITLE`]}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <p className="text-white text-2xl font-bold">Sorry, we can&#39;t allow you here.</p>
                    <p className="p-2 text-gray-500">You already completed this step.</p>
                    <p className="p-2 text-xl">If you missed something, please regen your link.</p>
                </div>

            </>
        )
    }

    if (props.state && props.state === "0x3") {
        return (
            <>
                <Head>
                    <title>{process.env[`NEXT_PUBLIC_STAGE_${props.stage}_TITLE`]}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <p className="text-white text-2xl font-bold">Sorry, we can&#39;t allow you here.</p>
                    <p className="p-2 text-gray-500">Make sure your previous steps are done.</p>
                    <p className="p-2 text-xl">If you missed something, please regen your link.</p>
                </div>

            </>
        )
    }

    if (!props || !props.username || !props.tag) {
        return (
            <>
                <Head>
                    <title>{process.env[`NEXT_PUBLIC_STAGE_${props.stage}_TITLE`]}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <p className="text-white text-2xl font-bold">Sorry, we can&#39;t allow you here.</p>
                    <p className="p-2 text-gray-500">There was an error while checking details.</p>
                    <p className="p-2 text-xl">In most of the cases, maybe your link is expired.</p>
                </div>

            </>
        )
    }

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
            return router.push("/")
        }

        const stat = await response.data && response.data.status
        setLoading(false)
        if (stat != "done") return router.push("/")

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

export async function getServerSideProps(context) {
    const { id, tag } = context.query
    // console.log("stage_3", context.query)
    if (!id || !tag) return {
        redirect: {
            permanent: false, destination: '/',
            status: 409
        }
    }

    //check for username and tag
    let userData = readDatabase(id.toString())
    if (!userData) {
        return {
            props: {
                username: id,
                tag,
                state: "0x1",
            }
        }

    }

    /*
        Here we will check for if the user's give tag is correct according to the database or not.
    */
    let bcrypt_response = await checkHash(`${userData.username}-${userData.string}`, tag)
    if (!bcrypt_response) return { props: { username: id, tag, state: "0x1" } }

    /*
        Here, we will check for if the user had already completed this step
    */

    if (!userData.stage_1) return { props: { username: id, tag, state: "0x3" } }
    if (!userData.stage_2) return { props: { username: id, tag, state: "0x3" } }
    if (userData.stage_final) return { props: { username: id, tag, state: "0x2" } }

    // switch (stage) {
    //     case '1':
    //         
    //         break;
    //     case '2':
    //         if (!userData.stage_1) return { props: { username: id, tag, state: "0x3", stage } }
    //         if (userData.stage_2) return { props: { username: id, tag, state: "0x2", stage } }
    //         if (userData.stage_final) return { props: { username: id, tag, state: "0x2", stage } }
    //         break;
    //     case '3':
    //         if (!userData.stage_1) return { props: { username: id, tag, state: "0x3", stage } }
    //         if (!userData.stage_2) return { props: { username: id, tag, state: "0x3", stage } }
    //         if (userData.stage_final) return { props: { username: id, tag, state: "0x2", stage } }
    //         break;
    //     default:
    //         return {
    //             redirect: {
    //                 permanent: false, destination: '/',
    //                 status: 409
    //             }
    //         }
    //         break;
    // }

    let a = await writeToDatabase(`${id}.stage_final`, true)
    // let a = true
    if (!a) {
        return {
            redirect: {
                permanent: false, destination: '/',
                status: 409
            }
        }
    }

    return {
        props: {
            username: id,
            tag,
        }
    }
} 
