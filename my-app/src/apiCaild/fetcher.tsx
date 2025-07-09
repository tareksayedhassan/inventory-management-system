import Cookie from "cookie-universal";

const cookie = Cookie();
export const fetcher = async (url: string) => {
  const token = cookie.get("Bearer");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  return res.json();
};
