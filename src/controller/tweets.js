import { getById as getUserById } from '../model/user'
import { twitterApi, token } from '../../config/twitter'

export const getTwitterData = (id, res) => {
  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found with this id' })
    }

    if (!user.twitter_username) {
      return res.status(400).json({
        error: 'No twitter username provided for this user'
      })
    }

    const query = '?count=200&trim_user=true&exclude_replies=true&screen_name='

    fetch(twitterApi + query + user.twitter_username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(response => {
        /* istanbul ignore if */
        if (response.status !== 200) {
          return res.status(500).json({ error: 'Could not connect to Twitter' })
        }

        response.json()
          .then(json => {
            return res.status(200).json(json)
          })
      })
      .catch(_ => {
        /* istanbul ignore next */
        return res.status(500).json({ error: 'Could not connect to Twitter' })
      })
  })
}
