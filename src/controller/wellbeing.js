import {
  getById as getUserById
} from '../model/user'

import {
  get as getWellbeing,
  create as createWellbeing
} from '../model/wellbeing'

export const create = (id, wellbeing, res) => {
  if (!id || !wellbeing) {
    return res.status(400).json({ error: 'Missing id or wellbeing field(s)' })
  }

  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(409).json({ error: 'No user found with this id' })
    }

    createWellbeing(id, wellbeing, (err, result) => {
      /* istanbul ignore if */
      if (err) {
        return res.status(500).json({ error: 'DB error' })
      }

      res.status(201).set({
        'Location': '/v1/users/' + result.id + '/wellbeings?limit=1'
      }).json(result)
    })
  })
}

export const get = (id, limit, res) => {
  getWellbeing(id, limit, (err, result) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    res.status(200).json({ id: id, results: result })
  })
}
