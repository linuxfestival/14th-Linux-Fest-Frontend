import {toast} from "react-toastify";

export const displayCommonErrorToast = (result: any) => {
    const payload = result.payload as {[key: string]: any};
    if (payload.detail)
        toast.error(payload.detail);
    else {
        const errorKey = Object.keys(payload)[0];
        const errorMessages = (payload[errorKey]?.slice(0, 1) as string[]).join(" ");
        toast.error(errorMessages || "An unexpected error occurred.");
    }
}