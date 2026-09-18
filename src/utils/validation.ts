export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobile?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export const validateRegisterForm = (
  data: RegisterFormData
): RegisterErrors => {
  const errors: RegisterErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.gender) {
    errors.gender = "Please select your gender";
  }

  if (!data.mobile.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (!validateMobile(data.mobile)) {
    errors.mobile = "Mobile number must be exactly 10 digits";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  }

  if (!data.city.trim()) {
    errors.city = "Please select your city";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (!validatePassword(data.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};