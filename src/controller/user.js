import { create as createUser } from '../model/user'

export const create = (req, res) => {
  const email = req.email
  const password = req.password // to be hashed

  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password field(s)' })

    return
  }

  createUser(email, password, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(201).set({
      'Location': '/users/' + user.id
    }).json(user)
  })
}
