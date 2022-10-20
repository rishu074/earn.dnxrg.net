import {readDatabase, writeToDatabase} from '../../helpers'

export default async function handler(req, res) {
  res.status(200).json({ status: true })

  console.log(await writeToDatabase("test.data", "loda2.0"))
}
