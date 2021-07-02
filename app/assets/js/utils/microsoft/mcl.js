
exports.getAuth = async (info) => {
    console.log(info)
    const userProfile = {
        access_token: info.authToken,
        client_token: null,
        uuid: info.profile.id,
        name: info.profile.name,
        user_properties: '{}'
    }
    return userProfile;
}
