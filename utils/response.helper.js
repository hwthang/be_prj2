export const buildResponse = (
  message = "Send a response successful",
  success = true,
  data = null
) => {
  return { success, message, data };
};
