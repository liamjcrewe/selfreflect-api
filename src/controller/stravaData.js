import {
  updateStravaToken as storeStravaToken,
  getById as getUserById
} from '../model/user'

import { stravaDataAPI, clientId, clientSecret } from '../../config/strava'

export const getStravaData = (id, res) => {
  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found with this id' })
    }

    const stravaToken = user.strava_token

    if (!stravaToken) {
      return res.status(400).json({
        error: 'Strava not connected for this user'
      })
    }

    fetch(stravaDataAPI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + stravaToken
      },
      body: JSON.stringify({
        'per_page': 200
      })
    })
      .then(response => {
        /* istanbul ignore if */
        if (response.status !== 200) {
          return res.status(500).json({ error: 'Could not connect to Strava' })
        }

        response.json()
          .then(json => {
            return res.status(200).json(json)
          })
      })
      .catch(_ => {
        /* istanbul ignore next */
        return res.status(500).json({ error: 'Could not connect to Strava' })
      })
  })
}
