import Swal from 'sweetalert2';

export const showAlert = (title, text, icon = 'success') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#4F46E5', // Indigo-600 matches your theme
    confirmButtonText: 'OK'
  });
};

export const showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4F46E5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!'
  });
};