import fs from 'fs';
import _eval from 'eval';

export default function deleteFromDatabase(...key) {
    var databaseFile = fs.readFileSync("./database.json")
    databaseFile = JSON.parse(databaseFile)

    let a = databaseFile

    key.map((v, i) => {
        try {
            a = a[v]
            
        } catch (error) {
            a = undefined
        }
    })

    let doesFileExists = a ? true : false

    if(doesFileExists) { 
        try {
            let eval_string = `var ot = JSON.parse('${JSON.stringify(databaseFile)}'); delete ot`
    
            key.map((v, i) => {
                // if(i === key.length-1) return
                eval_string += `["${v}"]`
            })

            eval_string += `; module.exports = ot;`

            // console.log(eval_string)
            // return true
    
            var eval_res = eval(eval_string)
    
            fs.writeFileSync('./database.json', JSON.stringify(eval_res, null, "\t"))
    
            return true
        } catch (error) {
            console.log(error)
            return false;
        }
    } else {
        return false
    }

    //write the database
    // fs.writeFileSync('./database.json', JSON.stringify(databaseFile, null, "\t"))

}