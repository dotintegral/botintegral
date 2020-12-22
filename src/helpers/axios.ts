import axios from "axios";
import { none, Option, some } from "fp-ts/lib/Option";
import { from, Observable } from "rxjs";

const fetchData = <T>(url: string): Promise<Option<T>> => {
  return axios
    .get<T>(url)
    .then((response) => response.data)
    .then((data) => some(data))
    .catch(() => none);
};

export const get = <T>(url: string): Observable<Option<T>> =>
  from(fetchData<T>(url));
