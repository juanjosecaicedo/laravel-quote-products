import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm as inertiaUseForm, Link, Head} from "@inertiajs/react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner"

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({
    message: "The email must be a valid email address."
  }),
  password: z.string().min(3),
  password_confirmation: z.string().min(3),
}).refine(data => data.password === data.password_confirmation, {
  message: "The password confirmation does not match.",
  path: ['password_confirmation']
})
export default function Register() {
  const {data, post, errors, setData} = inertiaUseForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  })

  const onSubmit = () => {
    post("/customer/register")
  }

  useEffect(() => {
    if (errors && "error" in errors) {
      const error = errors.error || errors.email || 'An error has occurred, try later';
      //@ts-ignore
      toast.error(error, {
        position: "top-right",
        classNames: {
          toast: "bg-red-100",
          title: 'text-red-500',
          icon: "text-red-500",
        }
      })
    }

    form.setError('email', {
      type: 'manual',
      message: errors.email
    })
  }, [errors])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 mt-5">
      <Head>
        <title>Sign Up</title>
      </Head>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Joe" {...field} onInput={handleInput}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} onInput={handleInput}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={isVisible ? "text" : "password"} placeholder="" {...field} onInput={handleInput}/>
                        <button
                          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={isVisible ? "Hide password" : "Show password"}
                          aria-pressed={isVisible}
                          aria-controls="password"
                        >
                          {isVisible ? (
                            <EyeOff size={16} strokeWidth={2} aria-hidden="true"/>
                          ) : (
                            <Eye size={16} strokeWidth={2} aria-hidden="true"/>
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="password_confirmation">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type={isVisible ? "text" : "password"} placeholder="" {...field} onInput={handleInput}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span>Already have an account </span>
            <Link href="/customer/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
