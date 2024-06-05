import { registerUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";

export const registrationHook = () =>
  useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registration successful");
      router.push("/login");
    },
  });
