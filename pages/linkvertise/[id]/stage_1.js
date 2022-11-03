import Head from 'next/head'
import Link from 'next/link'
import { writeToDatabase, readDatabase, checkHash, } from '../../../helpers'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
import { useRouter } from "next/router"

export default function Stage1(props) {
    //define returnable div
    const router = useRouter()

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
        } catch (error) {
            return router.push("/")
        }

        const next_step = await response.data.next_step
        router.push(next_step)
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

export async function getServerSideProps(context) {
    const { id, tag } = context.query
    // console.log("stage_1", context.query)
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

    if (userData.stage_1) return { props: { username: id, tag, state: "0x2" } }
    if (userData.stage_2) return { props: { username: id, tag, state: "0x2" } }
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

    // let a = await writeToDatabase(`${id}.stage_1`, true)
    // let a = true
    // if (!a) {
    //     return {
    //         redirect: {
    //             permanent: false, destination: '/',
    //             status: 409
    //         }
    //     }
    // }

    return {
        props: {
            username: id,
            tag,
        }
    }
} 
