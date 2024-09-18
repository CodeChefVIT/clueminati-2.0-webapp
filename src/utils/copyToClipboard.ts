import { toast } from "react-toastify";

export const copyToClipboard = (label: string) => {
  if (label) {
    void navigator.clipboard.writeText(label);
    toast.success("Team code copied to clipboard!");
  }
};
