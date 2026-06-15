"use client";
import { Dialog, Transition } from "@headlessui/react";
import type { ReactNode } from "react";
import { Fragment } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  cancelLabel?: string;
  onCancelClick?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmDanger?: boolean;
};

export const Modal = ({
  show,
  onClose,
  title,
  description,
  children,
  cancelLabel = "Cancel",
  onCancelClick,
  confirmLabel,
  onConfirm,
  confirmDanger = false,
}: Props) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
                  {title}
                </Dialog.Title>

                {description && (
                  <p className="mt-2 text-sm text-[#717D96]">{description}</p>
                )}

                {children && <div className="mt-2">{children}</div>}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] hover:bg-slate-50"
                    onClick={onCancelClick ?? onClose}
                  >
                    {cancelLabel}
                  </button>

                  {onConfirm && confirmLabel && (
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-white ${
                        confirmDanger
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-[#1F5FD6] hover:bg-[#184FB5]"
                      }`}
                      onClick={onConfirm}
                    >
                      {confirmLabel}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
