import { toast } from "react-hot-toast";

export const showSuccess = (msg) => {
  toast.success(msg, {
    duration: 3000,
    position: "top-center",
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    duration: 3000,
    position: "top-center",
  });
};

export const showToast = (msg) => {
  toast(msg, {
    duration: 3000,
    position: "top-center",
  });
};
