const getUserName = (request) => {
    return {
        firstname: request.user.sub.firstname,
        surname: request.user.sub.surname,
        id: request.user.sub._id
    }
}

module.exports = getUserName