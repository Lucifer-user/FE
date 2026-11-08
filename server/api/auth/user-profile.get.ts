export default defineEventHandler(async (event) => {
    return { displayName: 'Mock User', email: 'mock@user.com', photoURL: '', phoneNumber: '123456789' };
})
