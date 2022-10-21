import { readDatabase, writeToDatabase, random, deleteFromDatabase, createHash, checkHash, linkvertise } from '../../../helpers'
import type { NextApiRequest, NextApiResponse } from "next";
import hcaptcha from 'hcaptcha';
import axios from 'axios';


export default async function StageThree(req: NextApiRequest, res: NextApiResponse) {
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

    //delete the user
    // @ts-ignore: Unreachable code error
    let po = deleteFromDatabase(userdata.username.toString())
    if (!po) return res.status(500).json({ "error": "0xDELDB645x" })

    //check for stages
    // @ts-ignore: Unreachable code error
    if (!userdata.stage_1) return res.status(500).json({ "error": "0xUS06x" })
    // @ts-ignore: Unreachable code error
    if (!userdata.stage_2) return res.status(500).json({ "error": "0xUS06y" })
    // @ts-ignore: Unreachable code error
    if (!userdata.stage_final) return res.status(500).json({ "error": "0xUS06z" })
    // if (!userdata.stage_1) return res.status(500).json({ "error": "0xUS06x" })

    /*
        Now, the user is returned from linkvertise, we'll now give him the coins
    */

    

    let response;
    try {
        response = await axios.post(`${process.env.DASHBOARD_URL}/api/addcoins`, {
            // @ts-ignore: Unreachable code error
            id: userdata.username.toString(),
            coins: parseInt(process.env.COINS)
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.DASHBOARD_API}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
    } catch (error) {
        if (error && error.response && error.response.status && error.response.status === 404) return res.status(404).json({ "errror": "username not found." })

        return res.status(500).json({ "error": "0xAPDSH0s" })
    }

    if (await response.data && response.data.status != "success") return res.status(500).json({ "error": "0xDSHPI85" })

    return res.status(200).json({
        // @ts-ignore: Unreachable code error
        "username": userdata.username,
        "coins": parseInt(process.env.COINS),
        "status": "done"
    })


}

// export default create;
