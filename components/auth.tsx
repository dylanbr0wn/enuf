'use client'

import { Provider } from '@supabase/supabase-js'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from './button'
import { Input } from './input'
import { Separator } from './separator'
import { useSupabase } from './supabase-provider'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const emailSchema = z.string().email('Are you sure thats an email?')
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.')

function Auth() {
	const { resolvedTheme } = useTheme()
	const { supabase } = useSupabase()

	async function signInWithProvider(provider: Provider) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
		})
		if (error) {
			console.log(error)
		}
	}

	async function signInWithEmail(data: { email: string; password: string }) {
		const { error } = await supabase.auth.signInWithOtp({
			email: data.email,
			options: {
				emailRedirectTo: 'http://localhost:3000',
			},
		})
		if (error) {
			console.log(error)
		}
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(
			z.object({
				email: emailSchema,
			})
		),
	})

	return (
		<div className="flex flex-col gap-3">
			<div className="flex w-full gap-3">
				<Button
					onClick={() => signInWithProvider('github')}
					variant="outline"
					className="flex w-full gap-3"
				>
					<svg
						className="h-4 w-4 text-[#181717]"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>GitHub</title>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
					<span>Sign in with GitHub</span>
				</Button>
				<Button
					onClick={() => signInWithProvider('notion')}
					variant="outline"
					className="flex w-full gap-3 "
				>
					<svg
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						className="h-4 w-4 text-black"
					>
						<title>Notion</title>
						<path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
					</svg>
					<span>Sign in with Notion</span>
				</Button>
			</div>
			<div className="w-full text-center text-neutral-500">or</div>
			<div className=" rounded border border-neutral-300 p-4">
				<form onSubmit={handleSubmit(signInWithEmail)} className="flex flex-col gap-5 ">
					<h1>Sign in with email link</h1>
					<div className="w-full ">
						<Input
							data-valid={!!errors.email}
							{...register('email')}
							placeholder="Your email address"
							className=" border-neutral-200 data-[valid='true']:border-red-200"
						/>
						<Separator
							data-valid={!!errors.email}
							orientation="horizontal"
							className="w-full origin-left translate-y-[-1px] scale-x-0 bg-neutral-700 transition-transform peer-focus:scale-x-100 data-[valid='true']:bg-red-700 dark:bg-neutral-300"
						/>
						{errors.email && (
							<p role="alert" className="mt-2 px-3 text-sm text-red-500">
								{errors.email?.message}
							</p>
						)}
					</div>

					<Button className="flex w-full gap-3 ">
						<span>Sign in</span>
					</Button>
				</form>
				{/* <div className="mt-6 flex w-full flex-col gap-3">
					<Link href="/signup" className="text-center text-sm text-neutral-500">
						Forgot your password?
					</Link>
					<Link href="/signup" className="text-center text-sm text-neutral-500">
						Don't have an account? Sign up
					</Link>
				</div> */}
			</div>
		</div>
	)
}

export default Auth
