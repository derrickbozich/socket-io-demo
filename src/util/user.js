
export const findUser = (id, users) => {
    return users.find((user) => user.userID === id);
};

export const getCurrentUser = (users, socket) => {
    return users.find((user) => user.userID === socket.userID);
};

export const getCurrentMessagesWith = (users, otherUserID, socket) => {
    return findUser(getCurrentUser(users, socket).userID).messages
        .filter(message => message.from === otherUserID || message.to === otherUserID)
}