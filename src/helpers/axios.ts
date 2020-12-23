import axios from "axios";
import { none, Option, some } from "fp-ts/lib/Option";
import { from, Observable, of } from "rxjs";
import { getCached, saveCache } from "./cache";

const fetchData = <T>(url: string): Promise<Option<T>> => {
  return axios
    .get<T>(url)
    .then((response) => response.data)
    .then((data) => {
      saveCache(url)(data);
      return some(data);
    })
    .catch(() => none);
};

export const get = <T>(url: string): Observable<Option<T>> => {
  const cached = getCached<T>(url);

  if (cached) {
    return of(some(cached));
  }

  return from(fetchData<T>(url));
};
