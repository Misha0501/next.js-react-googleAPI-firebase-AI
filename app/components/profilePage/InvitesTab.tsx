"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import {
  useCompanyMemberships,
  useCreateMembership,
} from "@/providers/Memberships";
import {
  useCompanyMembershipInvites,
  useCreateCompanyMembershipInvites,
  useDeclineCompanyMembershipInvite,
  useDeleteCompanyMembershipInvite,
} from "@/providers/CompanyMembershipInvites";
import { Button, Select, SelectItem, TextInput } from "@tremor/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CompanyMembershipInvite } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { COMPANY_MEMBERSHIP_ROLE } from "../../lib/constants";
import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  TrashIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const InviteSchema = Yup.object().shape({
  applicationUserEmailReceiver: Yup.string()
    .email("Invalid email")
    .required("Required"),
  applicationUserRole: Yup.string().required("Required"),
});

interface FormValues {
  applicationUserEmailReceiver: string;
  applicationUserRole: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInviteStatus = (invite: CompanyMembershipInvite) => {
  if (invite.accepted) {
    return {
      label: `Accepted ${formatDate(String(invite.accepted))}`,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <CheckCircleIcon className="h-4 w-4" />,
      actionable: false,
    };
  }

  if (invite.declined) {
    return {
      label: `Declined ${formatDate(String(invite.declined))}`,
      className: "bg-rose-50 text-rose-700 border-rose-100",
      icon: <XCircleIcon className="h-4 w-4" />,
      actionable: false,
    };
  }

  if (new Date(invite.expiresAt) < new Date()) {
    return {
      label: "Expired",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      icon: <ClockIcon className="h-4 w-4" />,
      actionable: false,
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: <ClockIcon className="h-4 w-4" />,
    actionable: true,
  };
};

export const InvitesTab = () => {
  const { authToken } = useAuthContext();
  const companyMemberships = useCompanyMemberships({ authToken });
  const companyMembershipInvites = useCompanyMembershipInvites({
    authToken,
  });
  const [showModal, setShowModal] = useState(false);
  const [inviteToDecline, setInviteToDecline] =
    useState<CompanyMembershipInvite | null>(null);
  const [isPartOfCompany, setIsPartOfCompany] = useState(false);
  const [inviteToDelete, setInviteToDelete] =
    useState<CompanyMembershipInvite | null>(null);

  const createCompanyMembershipInvite = useCreateCompanyMembershipInvites({
    authToken,
  });
  const declineCompanyMembershipInvite = useDeclineCompanyMembershipInvite({
    authToken,
  });
  const deleteCompanyMembershipInvite = useDeleteCompanyMembershipInvite({
    authToken,
  });
  const createMembership = useCreateMembership({ authToken: authToken ?? "" });

  const formik = useFormik({
    initialValues: {
      applicationUserEmailReceiver: "",
      applicationUserRole: "",
    },
    validationSchema: InviteSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const invites = useMemo(
    () => companyMembershipInvites.data ?? [],
    [companyMembershipInvites.data],
  );

  const handleDeclineInvite = async () => {
    if (!inviteToDecline) return;
    try {
      const inviteId = inviteToDecline.id;
      setShowModal(false);
      setInviteToDecline(null);
      await declineCompanyMembershipInvite.mutateAsync({
        companyMembershipInviteId: inviteId,
      });

      companyMembershipInvites.refetch().catch(console.error);
      toast.success("Invite declined");
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong. Please try again later.",
      );
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await createCompanyMembershipInvite.mutateAsync(values);
      formik.resetForm();
      companyMembershipInvites.refetch().catch(console.error);
      toast.success("Invite sent");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || "Something went wrong. Please try again later.",
      );
    }
  };

  const closeModal = () => {
    setInviteToDecline(null);
    setInviteToDelete(null);
    setShowModal(false);
  };

  useEffect(() => {
    setIsPartOfCompany(
      Boolean(companyMemberships.isSuccess && companyMemberships.data),
    );
  }, [companyMemberships.data, companyMemberships.isSuccess]);

  const onDeclineClick = (companyMembershipInvite: CompanyMembershipInvite) => {
    setInviteToDelete(null);
    setInviteToDecline(companyMembershipInvite);
    setShowModal(true);
  };

  const onDeleteClick = (companyMembershipInvite: CompanyMembershipInvite) => {
    setInviteToDecline(null);
    setInviteToDelete(companyMembershipInvite);
    setShowModal(true);
  };

  const acceptInvite = async (
    companyMembershipInvite: CompanyMembershipInvite,
  ) => {
    try {
      await createMembership.mutateAsync({
        companyMembershipInviteId: companyMembershipInvite?.id,
      });
      toast.success("Invite accepted");
      await companyMembershipInvites.refetch().catch(console.error);
      await companyMemberships.refetch().catch(console.error);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Something went wrong. Please try again later.",
      );
    }
  };

  const handleDeleteInvite = async () => {
    if (!inviteToDelete) return;
    try {
      const inviteId = inviteToDelete.id;
      setShowModal(false);
      setInviteToDelete(null);

      await deleteCompanyMembershipInvite.mutateAsync({
        id: inviteId,
      });

      toast.success("Invite deleted");

      await companyMembershipInvites.refetch().catch(console.error);
    } catch (error: any) {
      toast.error(
        error?.message || "Something went wrong. Please try again later.",
      );
    }
  };

  const handleModalConfirm = () => {
    if (inviteToDecline) {
      handleDeclineInvite().catch(console.error);
    }
    if (inviteToDelete) {
      handleDeleteInvite().catch(console.error);
    }
  };

  return (
    <div className="space-y-6">
      {isPartOfCompany && (
        <form
          onSubmit={formik.handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                <UserPlusIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#2D3648]">
                  Invite a teammate
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#717D96]">
                  Send a company invitation to give someone access to your
                  agency workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:px-6 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
                <EnvelopeIcon className="h-4 w-4 text-[#1F5FD6]" />
                Receiver email
              </span>
              <TextInput
                value={formik.values.applicationUserEmailReceiver}
                onChange={(event) => {
                  formik.setFieldValue(
                    "applicationUserEmailReceiver",
                    event.target.value,
                    true,
                  );
                }}
                errorMessage={
                  formik.errors.applicationUserEmailReceiver &&
                  formik.touched.applicationUserEmailReceiver
                    ? formik.errors.applicationUserEmailReceiver
                    : undefined
                }
                error={Boolean(
                  formik.errors.applicationUserEmailReceiver &&
                  formik.touched.applicationUserEmailReceiver,
                )}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                Role
              </span>
              <Select
                onBlur={formik.handleBlur}
                id="applicationUserRole"
                onChange={(value) =>
                  formik.setFieldValue("applicationUserRole", value, true)
                }
                className="text-sm"
                value={formik.values.applicationUserRole}
              >
                {COMPANY_MEMBERSHIP_ROLE.map((item, index) => (
                  <SelectItem value={item} key={index}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              {formik.errors.applicationUserRole &&
              formik.touched.applicationUserRole ? (
                <div className="mt-2 text-sm text-rose-600">
                  {formik.errors.applicationUserRole}
                </div>
              ) : null}
            </label>
          </div>

          {createCompanyMembershipInvite.isError && (
            <div className="mx-5 mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 sm:mx-6">
              {createCompanyMembershipInvite.error?.message}
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 px-5 py-5 sm:px-6">
            <Button
              type="submit"
              disabled={createCompanyMembershipInvite.isLoading}
              icon={PaperAirplaneIcon}
            >
              {createCompanyMembershipInvite.isLoading
                ? "Sending..."
                : "Send invite"}
            </Button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#1F5FD6]">
                {isPartOfCompany ? "Sent invites" : "Received invites"}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#2D3648]">
                {invites.length} {invites.length === 1 ? "invite" : "invites"}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
              <EnvelopeIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {companyMembershipInvites.isLoading && (
            <p className="text-sm font-semibold text-[#717D96]">Loading...</p>
          )}
          {companyMembershipInvites.isError && (
            <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {companyMembershipInvites.error?.message}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            {companyMembershipInvites.isSuccess &&
              invites?.map((companyMembershipInvite) => {
                const status = getInviteStatus(companyMembershipInvite);

                return (
                  <article
                    className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5"
                    key={companyMembershipInvite.id}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </div>
                        <h4 className="mt-3 truncate text-lg font-semibold text-[#2D3648]">
                          {companyMembershipInvite.company?.name || "Company"}
                        </h4>
                        <p className="mt-1 text-sm text-[#717D96]">
                          Receiver:{" "}
                          {companyMembershipInvite.applicationUserEmailReceiver}
                        </p>
                      </div>

                      {status.actionable && (
                        <div className="flex flex-wrap gap-2">
                          {isPartOfCompany ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                              onClick={() =>
                                onDeleteClick(companyMembershipInvite)
                              }
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                                onClick={() =>
                                  onDeclineClick(companyMembershipInvite)
                                }
                              >
                                <XCircleIcon className="h-4 w-4" />
                                Decline
                              </button>
                              <Button
                                variant="primary"
                                icon={CheckCircleIcon}
                                onClick={() =>
                                  acceptInvite(companyMembershipInvite)
                                }
                              >
                                Accept
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase text-[#717D96]">
                          Sender
                        </dt>
                        <dd className="mt-1 truncate text-sm font-semibold text-[#2D3648]">
                          {companyMembershipInvite.applicationUserSender
                            ?.email || "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase text-[#717D96]">
                          Sent
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-[#2D3648]">
                          {formatDate(companyMembershipInvite.createdAt)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
          </div>

          {companyMembershipInvites.isSuccess && !invites?.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
                <EnvelopeIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#2D3648]">
                No invites yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#717D96]">
                {isPartOfCompany
                  ? "Send an invitation to add colleagues to your company workspace."
                  : "Company invitations sent to your account will appear here."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-[#2D3648]"
                  >
                    {inviteToDecline && "Decline this invitation?"}
                    {inviteToDelete && "Delete this invitation?"}
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-[#717D96]">
                    This will update the invitation status for everyone
                    involved.
                  </p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] hover:bg-slate-50"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-transparent bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                      onClick={handleModalConfirm}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
