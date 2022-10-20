import {readDatabase, writeToDatabase, random, deleteFromDatabase, createHash} from '../../../helpers'
import type { NextApiRequest, NextApiResponse } from "next";

export default async function StageOne(req: NextApiRequest, res: NextApiResponse) {
    //Checks fot token and other stuff
    const token = req.headers["token"] || undefined
    const username = req.body.username || undefined
    const tag = req.body.tag || undefined

    if(req.method != 'GET') return res.status(400).json({"error": "Bad request."})

    if(token === undefined || username === undefined || tag === undefined) return res.status(400).json({"error": "Bad request."})

    //the request have the essentials details

    //Hcaptcha auth
    // @ts-ignore: Unreachable code error
    let r = await hcaptcha.verify(process.env.HC_SECRET.toString(), token)
    if (!(r.success)) {
        return res.status(400).json({ "errorCode": "Bad Request" })
    }


    /*
        This request now have all needed credentials and captcha verified.
    */

}

// export default create;
