import {NextResponse} from 'next/server'
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";

/**
 * POST Route to register new users. it's only invoked be Google functions
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
  try {
    const deleteAllUsers = () => {
      let uids = []
      firebaseAdmin
        .auth()
        .listUsers(100)
        .then((listUsersResult) => {
          uids = uids.concat(listUsersResult.users.map((userRecord) => userRecord.uid))
          console.log(uids)
          if (listUsersResult.pageToken) {
            deleteAllUsers(listUsersResult.pageToken);
          }
        })
        .catch((error) => {
          console.log('Error listing users:', error);
        }).finally(() => {
        firebaseAdmin.auth().deleteUsers(uids)
      })
    };

    deleteAllUsers();
    return NextResponse.json({"message": "All users deleted"})
  } catch (e) {
    console.error(e)
    return new Response('Something went wrong please try again later', {
      status: 500,
    })
  }
}