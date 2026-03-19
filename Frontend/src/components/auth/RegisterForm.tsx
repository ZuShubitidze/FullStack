import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useState } from "react";
import { Input } from "../ui/input";
import { useRegister } from "../../hooks/useRegister";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle registration
  const { mutate: register, isPending } = useRegister();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl dark:bg-zinc-800 bg-blue-300"
    >
      <FieldSet>
        <FieldLegend>Register</FieldLegend>
        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Registering" : "Register"}
        </Button>
      </FieldSet>
    </form>
  );
};

export default RegisterForm;
