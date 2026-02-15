import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 min-h-[44px] min-w-[44px]',
	{
		variants: {
			variant: {
				default: 
          'bg-hostever-primary text-white shadow-lg shadow-hostever-primary/20 hover:bg-hostever-primary/90 hover:-translate-y-0.5',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
				outline:
          'border-2 border-hostever-primary/20 bg-transparent text-hostever-primary hover:bg-hostever-primary hover:text-white hover:border-hostever-primary',
				secondary:
          'bg-hostever-secondary text-white hover:bg-hostever-secondary/90 shadow-sm',
				ghost: 'hover:bg-hostever-secondary/10 hover:text-hostever-secondary text-gray-600',
				link: 'text-hostever-secondary underline-offset-4 hover:underline',
        gradient: 
          'bg-gradient-to-r from-hostever-primary to-hostever-secondary text-white shadow-lg shadow-hostever-secondary/25 hover:shadow-xl hover:shadow-hostever-secondary/35 hover:-translate-y-0.5 border-0',
			},
			size: {
				default: 'h-11 px-5 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-12 rounded-lg px-8 text-base',
				icon: 'h-11 w-11',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };