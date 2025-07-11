"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signUpSchema, type Role } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { authService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import Link from "next/link";

interface SignUpFormProps extends React.ComponentProps<"div"> {
  role?: Role;
}

type FormData = {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  role: Role;
  // Seller specific fields
  shop_name?: string;
  shop_url?: string;
  shop_description?: string;
};

export function SignUpForm({
  className,
  role = "customer",
  ...props
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      role,
      ...(role === "seller"
        ? {
            shop_name: "",
            shop_url: "",
            shop_description: "",
          }
        : {}),
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const submissionData = {
        ...data,
        role,
      };

      // Remove seller fields if customer
      if (role === "customer") {
        delete submissionData.shop_name;
        delete submissionData.shop_url;
        delete submissionData.shop_description;
      }

      // Call the registration API
      await authService.signUp(submissionData);

      // Show success message and redirect
      toast.success(
        role === "seller"
          ? "Pendaftaran berhasil! Silakan Masuk, selamat berjualan."
          : "Pendaftaran berhasil! Silakan Masuk, selamat berbelanja."
      );

      // Short delay before redirect to ensure toast is visible
      router.push("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const errorMessage =
          "Gagal mendaftar. Silakan periksa kembali data Anda dan coba lagi.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jl. Contoh No. 123"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jakarta"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DKI Jakarta"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {role === "seller" && (
                <>
                  <hr />
                  <FormField
                    control={form.control}
                    name="shop_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Toko</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nama Toko Anda"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shop_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Toko Online</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://tokoonline.com/toko-anda"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shop_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Toko</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ceritakan tentang toko Anda..."
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Buat Akun"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <Link href="/sign-in" className="underline underline-offset-4">
          Masuk
        </Link>
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Dengan melanjutkan, Anda setuju dengan{" "}
        <a href="#">Syarat dan Ketentuan</a> dan{" "}
        <a href="#">Kebijakan Privasi</a> kami.
      </div>
    </div>
  );
}
