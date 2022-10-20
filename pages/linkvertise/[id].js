import Head from 'next/head'
import Link from 'next/link'
import { writeToDatabase, readDatabase, checkHash,  } from '../../helpers'
import HCaptcha from '@hcaptcha/react-hcaptcha';


export default function Stage1(props) {
    //define returnable div

    if (props.state && props.state === "0x1") {
        return (
            <>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_STAGE_1_TITLE}</title>
                </Head>
                <div className="flex justify-center h-screen w-screen items-center flex-col">
                    <p className="text-white text-2xl font-bold">Sorry, we can&#39;t allow you here.</p>
                    <p className="p-2 text-gray-500">There was an error while checking details.</p>
                    <p className="p-2 text-xl">In most of the cases, maybe your link is expired.</p>
                </div>

            </>
        )
    }

    const handleVerificationSuccess = (token, ekey) => {
        console.log(token, ekey)
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
                state: "0x1"
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

    let a = await writeToDatabase(`${id}.stage_1`, true)

    return {
        props: {
            username: id,
            tag,
        }
    }
} 
