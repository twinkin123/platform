import { cva, type VariantProps } from "class-variance-authority";

const base = cva("inline-flex items-center justify-center rounded-md font-bold transition disabled:opacity-50", {
  variants: {
    intent: {
      primary: "bg-lime text-[#0a1400] hover:brightness-110",
      ghost: "text-ink-muted hover:bg-white/5 hover:text-ink",
      outline: "border border-surface-line bg-surface-card text-ink hover:border-white/25",
    },
    size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" },
  },
  defaultVariants: { intent: "primary", size: "md" },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof base>;

export default function Button({ intent, size, className, ...rest }: Props) {
  return <button className={base({ intent, size, className })} {...rest} />;
}
