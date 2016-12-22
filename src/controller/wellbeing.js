import {
  get as getWellbeing
} from '../model/wellbeing'

export const get = (id, limit, res) => {
  getWellbeing(id, limit, (err, result) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(200).json({ id: id, results: result })
  })
}

export const post = () => {

}
