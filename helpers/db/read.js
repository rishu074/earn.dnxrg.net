import fs from 'fs';

export default function readDatabase(...key) {
    var databaseFile = fs.readFileSync("./database.json")
    databaseFile = JSON.parse(databaseFile)

    let returnablePart = databaseFile

    try {
        key.map((v) => {
            returnablePart = returnablePart[v]
        })
    } catch (error) {
        returnablePart = undefined
    }

    return returnablePart

}