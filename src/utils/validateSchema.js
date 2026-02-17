import * as z from "zod";

export const validateSchema = (schema,data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true,data:result.data };
  }
  const errors = z.treeifyError(result.error).properties;
  const formattedErrors = {};
  Object.entries(errors).forEach(([key, value]) => {
    formattedErrors[key] = value.errors[0];
  });
  return { success: false, error: formattedErrors };
};