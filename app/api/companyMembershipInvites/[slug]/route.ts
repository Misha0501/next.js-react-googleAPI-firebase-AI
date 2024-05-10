import { ResponseError } from "@/app/lib/classes/ResponseError";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { handleAPIError } from "@/app/lib/api/handleError";
import { getActiveCompanyMembershipInviteById } from "@/app/api/companyMembershipInvites/_utils";
import { validateParamId } from "@/app/lib/api/validateParamId";
import { ApplicationUser } from "@/types";

/**
 * DELETE Route to delete a membership invite.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(
  request: Request,
  { params }: { params: { slug: number } },
) {
  try {
    const id = validateParamId(params.slug);

    const applicationUser: ApplicationUser = await getApplicationUserServer();

    const invite = await getActiveCompanyMembershipInviteById(id);

    if (!invite)
      throw new ResponseError(
        "Invite with the provided id wasn't found or it's expired.",
        404,
      );

    if (applicationUser.id !== invite.applicationUserIdSender)
      throw new ResponseError(
        "You aren't allowed to changed this property",
        401,
      );

    await prisma.companyMembershipInvite.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
