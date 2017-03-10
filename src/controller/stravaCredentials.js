import {
  updateStravaToken as storeStravaToken,
  getById as getUserById
} from '../model/user'

import { stravaTokenAPI, clientId, clientSecret } from '../../config/strava'

export const updateStravaToken = (id, code, res) => {
  if (!code) {
    return res.status(400).json({ error: 'No Strava code provided' })
  }

  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found with this id' })
    }

    fetch(stravaTokenAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'client_id': clientId,
        'client_secret': clientSecret,
        code
      })
    })
      .then(response => {
        /* istanbul ignore if */
        if (response.status !== 200) {
          return res.status(400).json({ error: 'Could not connect Strava' })
        }

        response.json()
          .then(json => {
            storeStravaToken(id, json.access_token, (err, _) => {
              /* istanbul ignore if */
              if (err) {
                return res.status(500).json({ error: 'DB error' })
              }

              return res.status(200).json({ message: 'Strava connected' })
            })
          })
      })
      .catch(_ => {
        /* istanbul ignore next */
        return res.status(500).json({ error: 'Could not connect to Strava' })
      })
  })
}
