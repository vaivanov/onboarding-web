import gql from 'graphql-tag';
import { fetchGraphQL, mutationGraphQL } from '../../GlobalActions';
import { getAllPlaygrounds, getPlaygroundDetails } from './PlaygroundReducer';
import { createLoadingSelector } from '../../api/Selectors';
import { getUser } from '../UserProfile/UserProfileReducer';


export const GET_PLAYGROUNDS = 'GET_PLAYGROUNDS'
export const REQUIRE_PLAYGROUND_DETAILS = 'REQUIRE_PLAYGROUND_DETAILS'
export const GET_PLAYGROUND_DETAILS = 'GET_PLAYGROUND_DETAILS'

export const CREATE_INITIATIVE = 'CREATE_INITIATIVE'
export const JOIN_INITIATIVE = 'JOIN_INITIATIVE'
export const CLAIM_MANAGER_ROLE = 'CLAIM_MANAGER_ROLE'
export const SET_SMOKEFREE_DATE = 'SET_SMOKEFREE_DATE'
export const SET_DECIDE_SMOKEFREE = 'SET_DECIDE_SMOKEFREE'
export const RECORD_PLAYGROUND_OBSERVATION = 'RECORD_PLAYGROUND_OBSERVATION'
export const SET_CHECKBOX = 'SET_CHECKBOX'


const getPlaygroundsQuery = gql`
  {
    playgrounds {
      id
      name
      lng
      lat
      status
      volunteerCount
      votes
    }
  }
`;

const getPlaygroundDetailsQuery = gql`
    query Query($playgroundId: String!) {
        playground(id: $playgroundId) {
            id
            name
            lng
            lat
            status
            smokeFreeDate
            volunteerCount
            votes
            jointChecklistItems
            ownChecklistItems
            playgroundObservations {
              observerId
              observerName
              smokefree
              observationDate
              comment
            }
            managers {
                id
                username
            }
            volunteers {
                userId
                userName
            }
        }
    }
`;

const createInitiativeQuery = gql`
    mutation CreateInitiative($input: CreateInitiativeInput!) {
        createInitiative(input: $input) {
          id
          name
          lng
          lat
          status
          smokeFreeDate
          volunteerCount
          votes
          jointChecklistItems
          ownChecklistItems
          managers {
              id
              username
          }
          volunteers {
              userId
              userName
          }
        }
    }
`;

const joinInitiativeQuery = gql`
    mutation JoinInitiative($input: JoinInitiativeInput!) {
        joinInitiative(input: $input) {
          id
          name
          lng
          lat
          status
          smokeFreeDate
          volunteerCount
          votes
          jointChecklistItems
          ownChecklistItems
          managers {
              id
              username
          }
          volunteers {
              userId
              userName
          }
        }
    }
`;

const claimManagerRoleQuery = gql`
  mutation ClaimManagerRole($input: ClaimManagerRoleCommand!) {
    claimManagerRole(input: $input) {
      id
      name
      lng
      lat
      status
      smokeFreeDate
      volunteerCount
      votes
      jointChecklistItems
      ownChecklistItems
      managers {
          id
          username
      }
      volunteers {
          userId
          userName
      }
    }
  }
`;

const setSmokefreeDateQuery = gql`
    mutation CommitToSmokeFreeDate($input: CommitToSmokeFreeDateCommand!) {
        commitToSmokeFreeDate(input: $input) {
            id
        }
    }
`;

const setDecideSmokefreeQuery = gql`
  mutation DecideToBecomeSmokeFree($input: DecideToBecomeSmokeFreeCommand!) {
    decideToBecomeSmokeFree(input: $input) {
      id
    }
  }
`;

const recordPlaygroundObservationQuery = gql`
  mutation RecordPlaygroundObservation($input: RecordPlaygroundObservationCommand!) {
    recordPlaygroundObservation(input: $input) {
      id
    }
  }
`;

const updateCheckboxQuery = gql`
  mutation UpdateChecklist($input: UpdateChecklistCommand!) {
    updateChecklist(input: $input) {
      id
    }
  }
`;


export const ensurePlaygrounds = () => (dispatch, getState) => {

  // console.log("ensurePlaygrounds, loading: " + createLoadingSelector([GET_PLAYGROUNDS])(getState()))

  return getAllPlaygrounds(getState()).length === 0 && !createLoadingSelector([GET_PLAYGROUNDS])(getState()) ? 
                                                                dispatch(fetchPlaygrounds()) : null
}

export const fetchPlaygrounds = () => {
  return fetchGraphQL(GET_PLAYGROUNDS, getPlaygroundsQuery)
}

export const ensurePlaygroundDetails = (playgroundId) => (dispatch, getState) => !getPlaygroundDetails(getState(), playgroundId) ? 
                                                                            dispatch(fetchPlaygroundDetails(playgroundId)) : null

export const fetchPlaygroundDetails = (playgroundId) => fetchGraphQL(GET_PLAYGROUND_DETAILS, getPlaygroundDetailsQuery, {playgroundId}, playgroundId)

export const createInitiative = (name, lat, lng, onSuccessCallback) => {
  return mutationGraphQL(CREATE_INITIATIVE, createInitiativeQuery, {
    input: {
      initiativeId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // generate a uuid
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
        }),
      name,
      lat,
      lng,
      type: "smokefree",
      status: "not_started",
    }
  },
  onSuccessCallback)
}
    
export const joinInitiative = (initiativeId, onSuccessCallback) => {
  return mutationGraphQL(JOIN_INITIATIVE, joinInitiativeQuery, {
    input: {
      initiativeId: initiativeId
    }
  },
  onSuccessCallback)
}
    
export const claimManagerRole = (initiativeId, onSuccessCallback) => {
  return (dispatch, getState) => {
  dispatch(mutationGraphQL(CLAIM_MANAGER_ROLE, claimManagerRoleQuery, {
    input: {
      initiativeId: initiativeId
    }
  },
  onSuccessCallback,
  {
    userProfile: getUser(getState())
  }
  ))
}
}
    
export const setSmokefreeDate = (initiativeId, smokeFreeDate) => {
  return mutationGraphQL(SET_SMOKEFREE_DATE, setSmokefreeDateQuery, {
    input: {
      initiativeId,
      smokeFreeDate
    }
  })
}

    
export const setDecideSmokefree = (initiativeId) => {
  return mutationGraphQL(SET_DECIDE_SMOKEFREE, setDecideSmokefreeQuery, {
    input: {
      initiativeId
    }
  })
}

export const recordPlaygroundObservation = (initiativeId, smokefree, comment, user) => {
  return mutationGraphQL(RECORD_PLAYGROUND_OBSERVATION, recordPlaygroundObservationQuery, {
    input: {
      initiativeId,
      observer: user.id,
      smokefree,
      comment
    }
  })
}

export const setCheckbox = (initiativeId, checklistItem, checked, user) => {
  return mutationGraphQL(SET_CHECKBOX, updateCheckboxQuery, {
    input: {
      initiativeId,
      actor: user.id,
      checklistItem,
      checked
      }
  })
}

