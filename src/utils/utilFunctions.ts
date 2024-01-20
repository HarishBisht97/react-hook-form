export const isValidIndianMobile = (value: any) => {
  const regex = /^[6-9]\d{9}$/; // Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits long
  return !value || regex.test(value);
};
