import Head from 'next/head'
import Link from 'next/link'
import { writeToDatabase, readDatabase, checkHash, } from '../../helpers'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Stage_1 from '../../components/stage_1'
import Stage_2 from '../../components/stage_2'
import Stage_3 from '../../components/stage_3';



export default function Stage1(props) {
    //define returnable div
    const stageString = `NEXT_PUBLIC_STAGE_${props.stage}_TITLE`

    console.log(process.env[stageString])

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

    if (props.stage && props.stage === '1') {
        return (
            <Stage_1 username={props.username} tag={props.tag} />
        )
    }

    if (props.stage && props.stage === '2') {
        return (
            <Stage_2 username={props.username} tag={props.tag} />
        )
    }

    if (props.stage && props.stage === '3') {
        return (
            <Stage_3 username={props.username} tag={props.tag} />
        )
    }

    return (
        <>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id, tag, stage } = context.query
    // console.log(context.query)
    if (!id || !tag || !stage) return {
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
                stage
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

    // if (userData[`stage_${stage}`] && userData[`stage_${stage}`] != undefined) return { props: { username: id, tag, state: "0x2", stage } }

    switch (stage) {
        case '1':
            if (userData.stage_1) return { props: { username: id, tag, state: "0x2", stage } }
            if (userData.stage_2) return { props: { username: id, tag, state: "0x2", stage } }
            if (userData.stage_final) return { props: { username: id, tag, state: "0x2", stage } }
            break;
        case '2':
            if (!userData.stage_1) return { props: { username: id, tag, state: "0x3", stage } }
            if (userData.stage_2) return { props: { username: id, tag, state: "0x2", stage } }
            if (userData.stage_final) return { props: { username: id, tag, state: "0x2", stage } }
            break;
        case '3':
            if (!userData.stage_1) return { props: { username: id, tag, state: "0x3", stage } }
            if (!userData.stage_2) return { props: { username: id, tag, state: "0x3", stage } }
            if (userData.stage_final) return { props: { username: id, tag, state: "0x2", stage } }
            break;
        default:
            return {
                redirect: {
                    permanent: false, destination: '/',
                    status: 409
                }
            }
            break;
    }

    let a = await writeToDatabase(stage != "3" ? `${id}.stage_${stage}` : `${id}.stage_final`, true)
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
            stage
        }
    }
} 
