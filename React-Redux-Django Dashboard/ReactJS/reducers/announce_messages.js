/**
 * Created by kgb on 9/12/17.
 */

import * as Announce_Message_Actions from  "../actions/announceMessageActions"

const initialState = {

    isLoadingAnnounceMessages: false,
    data: undefined
}

export default function announce_messages(state=initialState, action = {}){

    switch (action.type) {

        case Announce_Message_Actions.FETCH_MESSAGES:
            return {...state, isLoadingAnnounceMessages: true}
        case Announce_Message_Actions.FETCH_MESSAGES_SUCCESS:
            return {...state, isLoadingAnnounceMessages: false, data: action.res}
        case Announce_Message_Actions.FETCH_MESSAGES_ERROR400:
        case Announce_Message_Actions.FETCH_MESSAGES_ERROR500:
        case Announce_Message_Actions.FETCH_MESSAGES_FAILURE:
            return {...state, isLoadingAnnounceMessages: false}
        default:
            return state
  }
}








