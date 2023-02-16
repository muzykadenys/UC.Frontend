import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  USER_HISTORY_ERROR,
  USER_HISTORY_SUCCESS,
} from '../../../redux-store/fetchUserHistory/fetchUserHistoryConst'
import Card from '../../card/Card'
import '../userHistory/userHistory.scss'

function UserHistory() {
  const dispatch = useDispatch()

  const state = useSelector((state) => state)
  const user = state.user
  // current language
  const language = state.changeLanguage.lang
  const domain = state.startSettings.domain

  //--------------------------------------------

  /////////////////////////////////////////////////
  const getOtherArticleData = (id) => {
    const loc_lang = `${state.culture.data[language]['id']}`
    const urlArticle = `${domain}/api/${loc_lang}/ArticlesLocale/${id}`

    axios.get(urlArticle).then((res) => {
      const arr = state.userHistory.data
      arr.push(res.data)
      dispatch({
        type: USER_HISTORY_SUCCESS,
        payload: arr,
      })
    })
  }

  useEffect(() => {
    if (state.userHistory.loading) {
      const url = `${state.startSettings.userRequestDomain}/api/${user.data.email}/UserHistory`

      axios
        .get(url)
        .then((res) => {
          console.log(res)
          res.data.forEach((el) => {
            getOtherArticleData(el.title)
          })
        })
        .catch((e) => dispatch({ type: USER_HISTORY_ERROR, error: e }))
    }
  }, [])
  /////////////////////////////////////////////////

  return (
    <div className="UserHistory_section">
      <div className="UserHistory_section_wrap">
        {!state.userHistory.loading &&
          state.userHistory.data.map((el, index) => {
            console.log(el)
            // return <Card el={el} key={`UHSWDM__${index}_`} />
          })}
      </div>
    </div>
  )
}

export default React.memo(UserHistory)
