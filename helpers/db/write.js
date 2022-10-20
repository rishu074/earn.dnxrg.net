import fs from 'fs';
import _eval from 'eval';

export default async function writeToDatabase(key, value) {
    var databaseFile = fs.readFileSync("./database.json")
    databaseFile = JSON.parse(databaseFile)

    let a = databaseFile

    key = key.split(".")

    key.map((v) => {
        try {
            a = a[v]
            
        } catch (error) {
            a = undefined
        }
    })

    let doesFileExists = a ? true : false

    if(doesFileExists) { 
        let eval_string = `var ot = JSON.parse('${JSON.stringify(databaseFile)}'); ot`

        key.map((v, i) => {
            if(i === key.length-1) return
            eval_string += `["${v}"]`
        })

        eval_string += `.${key[key.length-1]} = '${value}'; module.exports = ot`

        var eval_res = eval(eval_string)

        fs.writeFileSync('./database.json', JSON.stringify(eval_res, null, "\t"))

        return true
    } else {
        console.log("file dosen't exists")
    }

    databaseFile = {
        ...databaseFile,
        [`mera.lol`]: value
    }

    //write the database
    // fs.writeFileSync('./database.json', JSON.stringify(databaseFile, null, "\t"))

}