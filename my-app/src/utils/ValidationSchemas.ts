import * as z from "zod";

export const registervalidate = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginValidate = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const registerClient = z
  .object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginClient = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const FormSchema = z.object({
  selectedProductId: z.number({ invalid_type_error: "يجب اختيار الصنف." }),
  selectedSupplierId: z.number({ invalid_type_error: "يجب اختيار المورد." }),
  selectedTreasuryId: z.number({ invalid_type_error: "يجب اختيار الخزينة." }),
  userId: z.number({ invalid_type_error: "حدث خطأ في تعريف المستخدم." }),
  total: z.number().refine((val) => val > 0, {
    message: "المبلغ لا يمكن أن يكون صفرًا.",
  }),

  treasuryBalance: z.number().refine((val) => val >= 0, {
    message: "الرصيد المتاح بالخزينة غير كافٍ.",
  }),
});
