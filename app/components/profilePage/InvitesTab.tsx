"use client";

import React, { Fragment, useEffect, useState } from "react";
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
import { TrashIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { COMPANY_MEMBERSHIP_ROLE } from "../../lib/constants";

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
  const [inviteToDelete, setInviteToDelete] =
    useState<CompanyMembershipInvite | null>(null);

  const formik = useFormik({
    initialValues: {
      applicationUserEmailReceiver: "",
      applicationUserRole: "",
    },
    validationSchema: InviteSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleDeclineInvite = async () => {
    if (!inviteToDecline) return;
    try {
      setShowModal(false);
      setInviteToDecline(null);
      await declineCompanyMembershipInvite.mutateAsync({
        companyMembershipInviteId: inviteToDecline?.id,
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
    setShowModal(false);
  };

  useEffect(() => {
    if (!companyMemberships.isSuccess || !companyMemberships.data) return;

    setIsPartOfCompany(true);
  }, [companyMemberships.data, companyMemberships.isSuccess]);

  const onDeclineClick = (companyMembershipInvite: CompanyMembershipInvite) => {
    setInviteToDecline(companyMembershipInvite);
    setShowModal(true);
  };

  const onDeleteClick = (companyMembershipInvite: CompanyMembershipInvite) => {
    setShowModal(true);
    setInviteToDelete(companyMembershipInvite);
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
      setShowModal(false);
      setInviteToDelete(null);

      await deleteCompanyMembershipInvite.mutateAsync({
        id: inviteToDelete?.id,
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
      handleDeleteInvite();
    }
  };
  return (
    <div>
      <div className="mt-10 w-full">
        {isPartOfCompany && (
          <form onSubmit={formik.handleSubmit} className={"mb-12"}>
            <div className="mb-7">
              <p className={"mb-2"}>Receiver email</p>
              <TextInput
                defaultValue={formik.values.applicationUserEmailReceiver}
                onChange={(event) => {
                  formik.values.applicationUserEmailReceiver =
                    event.target.value;
                }}
                errorMessage={
                  formik.errors.applicationUserEmailReceiver &&
                  formik.touched.applicationUserEmailReceiver
                    ? formik.errors.applicationUserEmailReceiver
                    : undefined
                }
                error={
                  formik.errors.applicationUserEmailReceiver &&
                  formik.touched.applicationUserEmailReceiver
                    ? true
                    : undefined
                }
              />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Role</p>
              <Select
                onBlur={formik.handleBlur}
                id="buildingtype"
                onChange={(e) =>
                  formik.setFieldValue("applicationUserRole", e, true)
                }
                className={"text-sm mb-2"}
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
                <div className="text-red-500 text-sm">
                  {formik.errors.applicationUserRole}
                </div>
              ) : null}
            </div>
            {createCompanyMembershipInvite.isError && (
              <div className="text-red-500 text-sm mb-7">
                {/* @ts-ignore */}
                {createCompanyMembershipInvite.error?.message}
              </div>
            )}

            <Button
              type={"submit"}
              disabled={createCompanyMembershipInvite.isLoading}
            >
              Send invite
            </Button>
          </form>
        )}

        <div>
          {isPartOfCompany && (
            <p className={"font-bold text-2xl mb-8"}>Sent Invites</p>
          )}
          {!isPartOfCompany && (
            <p className={"font-bold text-2xl mb-8"}>Received Invites</p>
          )}
          {companyMembershipInvites.isLoading && <p>Loading...</p>}
          {companyMembershipInvites.isError && (
            <p>{companyMembershipInvites.error?.message}</p>
          )}
          <div className={"flex flex-col gap-3"}>
            {companyMembershipInvites.isSuccess &&
              companyMembershipInvites?.data &&
              companyMembershipInvites?.data?.length !== 0 &&
              companyMembershipInvites?.data?.map(
                (companyMembershipInvite: CompanyMembershipInvite, index) => {
                  return (
                    <div
                      className="p-8 flex flex-col bg-[#F7F9FC] rounded-xl"
                      key={index}
                    >
                      <div className="border-b flex justify-between py-3">
                        <span className={"w-1/2 text-gray-500"}>Sender</span>
                        <span className={"w-1/2"}>
                          {companyMembershipInvite.applicationUserSender?.email}
                        </span>
                      </div>
                      <div className="border-b flex justify-between py-3">
                        <span className={"w-1/2 text-gray-500"}>Company</span>
                        <span className={"w-1/2"}>
                          {companyMembershipInvite.company?.name}
                        </span>
                      </div>
                      <div className="border-b flex justify-between py-3">
                        <span className={"w-1/2 text-gray-500"}>Receiver</span>
                        <span className={"w-1/2"}>
                          {companyMembershipInvite.applicationUserEmailReceiver}
                        </span>
                      </div>
                      <div className="border-b flex justify-between py-3">
                        <span className={"w-1/2 text-gray-500"}>Sent</span>
                        <span className={"w-1/2"}>
                          {companyMembershipInvite.createdAt}
                        </span>
                      </div>
                      <div className="border-b flex justify-between py-3">
                        <span className={"w-1/2 text-gray-500"}>Status</span>
                        {companyMembershipInvite.accepted && (
                          <span className={"w-1/2"}>
                            Accepted on {companyMembershipInvite.accepted}
                          </span>
                        )}
                        {companyMembershipInvite.declined && (
                          <span className={"w-1/2"}>
                            Declined on {companyMembershipInvite.declined}
                          </span>
                        )}
                        {!companyMembershipInvite.accepted &&
                          !companyMembershipInvite.declined &&
                          new Date(companyMembershipInvite.expiresAt) >
                            new Date() && (
                            <span className={"w-1/2"}>Pending</span>
                          )}
                        {!companyMembershipInvite.accepted &&
                          !companyMembershipInvite.declined &&
                          new Date(companyMembershipInvite.expiresAt) <
                            new Date() && (
                            <span className={"w-1/2"}>Expired</span>
                          )}
                      </div>
                      {!companyMembershipInvite.accepted &&
                        !companyMembershipInvite.accepted &&
                        new Date(companyMembershipInvite.expiresAt) >
                          new Date() && (
                          <>
                            {isPartOfCompany && (
                              <div
                                className={
                                  "flex items-center gap-2 text-red-600 cursor-pointer mt-4 w-fit"
                                }
                                onClick={() =>
                                  onDeleteClick(companyMembershipInvite)
                                }
                              >
                                <TrashIcon className={"h-8 w-8"} />
                                <span>Delete</span>
                              </div>
                            )}
                            {!isPartOfCompany && (
                              <div className={"flex gap-3 mt-7 items-center"}>
                                <div
                                  className={
                                    "flex items-center gap-2 text-red-600 cursor-pointer w-fit"
                                  }
                                  onClick={() =>
                                    onDeclineClick(companyMembershipInvite)
                                  }
                                >
                                  <TrashIcon className={"h-8 w-8"} />
                                  <span>Decline</span>
                                </div>
                                <Button
                                  variant={"secondary"}
                                  onClick={() =>
                                    acceptInvite(companyMembershipInvite)
                                  }
                                >
                                  Accept
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  );
                },
              )}
          </div>
          {companyMembershipInvites.isSuccess &&
            companyMembershipInvites?.data &&
            !companyMembershipInvites?.data?.length && (
              <p className={"text-gray-500"}>
                You havent received any invites yet
              </p>
            )}
        </div>
      </div>
      {/* Confirmation modal*/}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {inviteToDecline && (
                        <span>
                          Are you sure you want to decline this invitation?
                        </span>
                      )}

                      {inviteToDelete && (
                        <span>
                          Are you sure you want to delete this invitation?
                        </span>
                      )}
                    </Dialog.Title>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
