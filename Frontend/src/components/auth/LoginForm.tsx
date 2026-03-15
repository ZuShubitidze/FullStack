import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  // Handle login with useLogin hook
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 rounded-2xl dark:bg-zinc-800 bg-blue-300"
    >
      <FieldSet>
        {/* Title */}
        <FieldLegend>Log in to your account</FieldLegend>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        {/* Password */}
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit">Submit</Button>
      </FieldSet>
    </form>
  );
};

export default LoginForm;
