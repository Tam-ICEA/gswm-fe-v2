import Swal from "sweetalert2";

export const showSuccessAlert = (msg, text = "") => {
  return Swal.fire({
    icon: "success",
    title: msg.replace(/\[ERR_[0-9]+\]/g, ""),
    text: text.replace(/\[ERR_[0-9]+\]/g, ""),
  });
};

export const showErrorAlert = (msg, text = "") => {
  return Swal.fire({
    icon: "error",
    title: msg.replace(/\[ERR_[0-9]+\]/g, ""),
    text: text.replace(/\[ERR_[0-9]+\]/g, ""),
  });
};

export const showWarning = (msg, text) => {
  return Swal.fire({
    icon: "warning",
    title: msg.replace(/\[ERR_[0-9]+\]/g, ""),
    text: text.replace(/\[ERR_[0-9]+\]/g, ""),
  });
};
