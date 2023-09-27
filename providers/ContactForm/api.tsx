import service from "@/services";

export async function create(
  props: any,
) {
  return service({
    method: "POST",
    url: `/api/contactForm`,
    body: props.data,
  });
}
