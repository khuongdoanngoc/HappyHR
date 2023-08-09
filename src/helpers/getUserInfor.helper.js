const getUserName = (request) => {
    return {
        firstname: request.user.sub.firstname,
        surname: request.user.sub.surname
    }
}

module.exports = getUserName