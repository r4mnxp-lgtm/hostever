import * as React from "react"

import { cn } from "@/lib/utils"

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive" && "border-red-500 bg-red-50 text-red-900",
        !variant && "border-gray-200 bg-white",
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium",
        className
      )}
      {...props}
    />
  )
})
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100",
        className
      )}
      {...props}
    >
      ×
    </button>
  )
})
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  )
})
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
})
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastAction, ToastClose, ToastTitle, ToastDescription }
