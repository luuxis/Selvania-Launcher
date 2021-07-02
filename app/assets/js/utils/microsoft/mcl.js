
exports.getAuth = async (info) => {
    console.log(info)
    const userProfile = {
        access_token: info.access_token,
        client_token: null,
        uuid: info.profile.id,
        name: info.profile.name,
        user_properties: '{}'
    }
    return userProfile;
}
