import {readDatabase, writeToDatabase, deleteFromDatabase} from '../../helpers'
// import type { NextApiRequest, NextApiResponse } from "next";


export default async function status(req, res) {
  return res.status(200).json({ status: true })
}
