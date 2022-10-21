import {readDatabase, writeToDatabase, random, deleteFromDatabase, createHash} from '../../helpers'
import type { NextApiRequest, NextApiResponse } from "next";


export default async function status(req: NextApiRequest, res: NextApiResponse) {
    //Checks fot token and other stuff
    const token = req.headers["token"] || undefined
    const username = req.body.username || undefined

    if(req.method != 'POST') return res.status(400).json({"error": "Bad request."})

    if(token === undefined || username === undefined) return res.status(400).json({"error": "Bad request."})

    //the request have the essentials details
    // @ts-ignore: Unreachable code error
    if(token.toString() != process.env.API_TOKEN.toString()) return res.status(401).json({"error": "401 Unauthorized"})


    //request is now safe
    //username is validated on the client's side so its good
    //now we have to create the datastructure

    //delete if already exists
    let a = readDatabase(username.toString())
    if(a) {
        let b = deleteFromDatabase(username.toString())
        if(!b) return res.status(500).json({"error": "There was an error on the server and the request could not be completed. Error code: 0xDB01"})
    }
    let dataString = random(32)

    let c = writeToDatabase(username.toString(), {
        "username": username.toString(),
        "string": dataString,
        "created": Date.now(),
        "stage_1": false,
        "stage_2": false,
        "stage_final": false
    })

    if(!c) return res.status(500).json({"error": "There was an error on the server and the request could not be completed. Error code: 0xDB02"})

    let userHash = await createHash(10, `${username.toString()}-${dataString}`)

    return res.status(200).json({
        "username": username.toString(),
        "expires_in": parseInt(process.env.EXPIRES_IN),
        "url": `${process.env.APP_URL}/linkvertise/${username.toString()}/stage_1?tag=${userHash}`
    })

}

// export default create;
