import Link from "next/link";
import { toast } from "react-toastify";

export const SESSION_EXPIRED_EVENT = "homfli:session-expired";
const SESSION_EXPIRED_TOAST_ID = "session-expired";

/**
 * Called from anywhere a fetch comes back 401 for a call that expected the
 * caller to already be authenticated (i.e. not the proactive "please sign
 * in" checks, which never reach the API in the first place). Shows one
 * de-duplicated toast and tells AuthContext to drop its user immediately,
 * rather than waiting for the next unrelated /api/auth/me refresh.
 */
export const notifySessionExpired = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));

  toast.error(
    <span>
      Your session has expired.{" "}
      <Link
        href="/signin"
        className="font-semibold underline"
        onClick={() => toast.dismiss(SESSION_EXPIRED_TOAST_ID)}
      >
        Sign in again
      </Link>
    </span>,
    { toastId: SESSION_EXPIRED_TOAST_ID },
  );
};
