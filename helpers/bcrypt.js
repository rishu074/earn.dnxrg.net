import bcrypt from 'bcrypt'

export const createHash = async (saltRounds, data) => {
    let a;
    try {
        a = bcrypt.hashSync(data.toString(), saltRounds)
    } catch (error) {
        if (error) {
            console.log(`erorr while hasing password (registeration): ${error}`)
            process.exit(2);
        }
    }

    return a;
}

export const checkHash = async (data, hash) => {
    let a;
    try {
        a = bcrypt.compareSync(data.toString(), hash.toString())
    } catch (error) {
        if (error) {
            console.log(`erorr while comparing password (registeration): ${error}`)
            process.exit(2);
        }
    }

    return a;
}