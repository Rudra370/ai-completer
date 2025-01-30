/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from "wouter";
import { useSearch } from "wouter/use-location";

export const useQueryParams = () => {
    const [location, navigate] = useLocation();
    const search = useSearch();

    const get = (key: string) => {
        return (new URLSearchParams(search)).get(key);
    }

    const set = (key: string, value: string) => {
        const params = new Map(new URLSearchParams(search));
        let url = location;
        params.set(key, value);
        url += "?" + new URLSearchParams(params as any).toString();
        navigate(url, { replace: true });
    }

    const remove = (key: string) => {
        const params = new Map(new URLSearchParams(search));
        let url = location;
        params.delete(key);
        url += "?" + new URLSearchParams(params as any).toString();
        navigate(url, { replace: true });
    }

    return { get, set, remove, navigate };
}
