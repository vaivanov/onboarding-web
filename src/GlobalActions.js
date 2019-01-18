export const PUBLISH_ENVIRONMENT = 'PUBLISH_ENVIRONMENT'
export const PUBLISH_GRAPHQLCLIENT = 'PUBLISH_GRAPHQLCLIENT'

export const REQUEST_POSTFIX = '_REQUEST'
export const SUCCESS_POSTFIX = '_SUCCESS'
export const FAILURE_POSTFIX = '_FAILURE'


export const publishEnvironment = environmentProperties => (
    {type: PUBLISH_ENVIRONMENT, environmentProperties}
  )

export const publishGraphQLClient = client => (
    {type: PUBLISH_GRAPHQLCLIENT, client}
  )


export const fetchGraphQL = (baseActionIdentifier, graphQLQuery) => {
  return (dispatch, getState) => {
      const graphQLClient = getState().graphQLClient;
      dispatch({type: baseActionIdentifier + REQUEST_POSTFIX})

      return graphQLClient.query({
        query: graphQLQuery
      })
        .then(data => dispatch({ type: baseActionIdentifier + SUCCESS_POSTFIX, payload: data }))
        .catch(error => dispatch({ type: baseActionIdentifier + FAILURE_POSTFIX, payload: error, error: true }));
      
    }
  }

export const mutationGraphQL = (baseActionIdentifier, graphQLMutation, variables) => {
  return (dispatch, getState) => {
      const graphQLClient = getState().graphQLClient;
      dispatch({type: baseActionIdentifier + REQUEST_POSTFIX})

      return graphQLClient.mutate({
        mutation: graphQLMutation,
        variables
      })
        .then(data => {
          if (data.errors && data.errors[0]) {
            console.log('graphQL mutation success with error:')
            console.log(data)
              dispatch({ type: baseActionIdentifier + FAILURE_POSTFIX, payload: {code: data.errors[0].code, message: data.errors[0].niceMessage}})
          }
          else {
            console.log('graphQL mutation success:')
            console.log(data)
              dispatch({ type: baseActionIdentifier + SUCCESS_POSTFIX, payload: data, variables })
          }
        })
        .catch(error => {
          console.log('graphQL mutation error:')
          console.log(error)
          dispatch({ type: baseActionIdentifier + FAILURE_POSTFIX, payload: error})
        });
      
    }
  }




