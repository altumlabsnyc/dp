import { mutate } from "swr";

export default async function revalidate(key: any) {
  return mutate(key);
}
