// import { account } from "@/backend/configs/config";
//
// export default async function completeResetPassword(
//     { userId, secret, newPassword }:
//         { userId: string, secret: string, newPassword: string }) {
//
//     const res = await account.updateRecovery(
//         `${userId}`,
//         `${secret}`,
//         `${newPassword}`,
//     ).then(() => {
//         return true
//     }).catch(() => {
//         return false
//     })
//
//     return res
// }

// Replace this import with a mock password reset handler
import mockPasswordReset from '@/backend/data/mockPasswordReset';

export default async function completeResetPassword(
    { userId, secret, newPassword }:
        { userId: string, secret: string, newPassword: string }) {

    try {
        const res = await mockPasswordReset(userId, secret, newPassword);
        return res;
    } catch (error) {
        console.error("Error resetting password:", error);
        return false;
    }
}
