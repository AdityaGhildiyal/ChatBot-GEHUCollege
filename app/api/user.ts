import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/lib/MongoDB'
import User from '@/models/UserModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const session = await getSession({ req })

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userId = session.user.id

    await connectToDatabase()

    const user = await User.findOne({ userId }).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}


