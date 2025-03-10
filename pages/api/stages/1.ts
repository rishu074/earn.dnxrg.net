import { readDatabase, writeToDatabase, random, deleteFromDatabase, createHash, checkHash } from '../../../helpers'
import type { NextApiRequest, NextApiResponse } from "next";
import hcaptcha from 'hcaptcha';


export default async function StageOne(req: NextApiRequest, res: NextApiResponse) {
    //Checks fot token and other stuff
    const token = req.headers["token"] || undefined
    const username = req.body.username || undefined
    const tag = req.body.tag || undefined

    if (req.method != 'POST') return res.status(400).json({ "error": "Bad request." })

    if (token === undefined || username === undefined || tag === undefined) return res.status(400).json({ "error": "Bad request. 0xD96ox" })

    //the request have the essentials details

    //Hcaptcha auth
    // @ts-ignore: Unreachable code error
    let r = await hcaptcha.verify(process.env.HC_SECRET.toString(), token)
    if (!(r.success)) {
        return res.status(401).json({ "errorCode": "Bad request. 0rTpx" })
    }


    /*
        This request now have all needed credentials and captcha verified.

        The complete mechanism is to reset the dataString everytime, then hash it and send it back to the client.
    */

    //fetch the user
    let userdata = readDatabase(username);
    if (!userdata) return res.status(500).json({ "error": "Error code: 0xDB94" })
    // @ts-ignore: Unreachable code error

    
    
    //read the tag
    // @ts-ignore: Unreachable code error
    let bcrypt_response = await checkHash(`${userdata.username}-${userdata.string}`, tag)
    if (!bcrypt_response) return res.status(500).json({ "error": "0xBC78s" })

    //update stage
    let a = writeToDatabase(`${username}.stage_1`, true)
    userdata = readDatabase(username);
    
    //check for stages
    // @ts-ignore: Unreachable code error
    if (!userdata.stage_1) return res.status(500).json({ "error": "0xUS06x" })
    // @ts-ignore: Unreachable code error
    if (userdata.stage_2) return res.status(500).json({ "error": "0xUS06y" })
    // @ts-ignore: Unreachable code error
    if (userdata.stage_final) return res.status(500).json({ "error": "0xUS06z" })

    //the request seems to be genuine
    //regenrate strings
    let newstring = random(32)

    let b = writeToDatabase(`${username}.string`, newstring)
    if (!b || !a) return res.status(500).json({ "error": "Error code: 0xDBW936" })


    //generate new url
    // @ts-ignore: Unreachable code error
    let newtag = await createHash(10, `${userdata.username}-${newstring}`)

    // @ts-ignore: Unreachable code error
    return res.status(200).json({
        "username": username,
        // @ts-ignore: Unreachable code error
        "next_step": `${process.env.APP_URL}/linkvertise/${userdata.username.toString()}/stage_2?tag=${newtag}`
    })
}

// export default create;
