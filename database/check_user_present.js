import fetchUsers from './fetch_users';

const checkUserPresent = () => {
  console.log('checkUserPresent function');
  return fetchUsers()
  .then( (result) => { 
    return (result.length > 0)
  })
  .catch( (error) => {
    console.log(error)
    return false
  })
}

export default checkUserPresent