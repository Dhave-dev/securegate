export function getPasswordStrength(password: string) {
  if (password.length === 0) return null

  if (password.length < 8) {
    return { label: "Weak", color: "bg-red-500 text-red-500", width: "w-1/3" }
  }

  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  if (password.length >= 12 && hasUpper && hasNumber && hasSymbol) {
    return { label: "Strong", color: "bg-green-500 text-green-500", width: "w-full" }
  }

  return { label: "Fair", color: "bg-yellow-500 text-yellow-500", width: "w-2/3" }
}

export default function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password)

  if (!strength) {
    return (
      <div className="mt-2 h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
    )
  }

  return (
    <div className="mt-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex">
        <div 
          className={`h-full transition-all duration-300 ${strength.color.split(" ")[0]} ${strength.width}`}
        />
      </div>
      <p className={`mt-1 text-xs font-medium ${strength.color.split(" ")[1]}`}>
        {strength.label}
      </p>
    </div>
  )
}
