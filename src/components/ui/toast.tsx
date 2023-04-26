import toast from "react-hot-toast";

const toastError = (message: string) => toast.error(message);
const toastSuccess = (message: string) => toast.success(message);

export { toastError, toastSuccess };
