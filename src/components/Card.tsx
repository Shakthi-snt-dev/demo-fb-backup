import React, { forwardRef } from "react";
import type { ElementType } from "react";
import { twMerge } from "tailwind-merge";

/** ---------------- Polymorphic helpers ---------------- */
type PolymorphicRef<C extends ElementType> = React.ComponentPropsWithRef<C>["ref"];
type PolymorphicProps<C extends ElementType, Props = {}> =
  Props & Omit<React.ComponentPropsWithoutRef<C>, keyof Props | "as"> & { as?: C };

/** ---------------- Card props & styles ---------------- */
type Variant = "elevated" | "outline" | "soft" | "ghost";
type Padding = "none" | "sm" | "md" | "lg";
type Radius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
type Shadow = "none" | "sm" | "md" | "lg" | "xl";

interface CardBaseProps {
  /** Visual style */
  variant?: Variant;
  /** Add hover lift + focus ring */
  interactive?: boolean;
  /** Add subtle press (scale) on active */
  pressable?: boolean;
  /** Rounded corners */
  rounded?: Radius;
  /** Inner padding for Content slot */
  padding?: Padding;
  /** Shadow level (elevated overrides this) */
  shadow?: Shadow;
  /** Optional border toggle (useful with ghost/soft) */
  bordered?: boolean;
  /** Extra classes (width, responsive, etc.) */
  className?: string;
}

/** Utilities */
const padMap: Record<Padding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const radiusMap: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const shadowMap: Record<Shadow, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const variantBase = (variant: Variant) => {
  switch (variant) {
    case "elevated":
      return "bg-white/90 dark:bg-neutral-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-neutral-900/60 border border-black/5 shadow-md";
    case "outline":
      return "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800";
    case "soft":
      return "bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100/80 dark:border-neutral-800/60";
    case "ghost":
    default:
      return "bg-transparent";
  }
};

const interactiveBase =
  "transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400";

/** ---------------- Card (polymorphic) ---------------- */
type CardProps<C extends ElementType> = PolymorphicProps<C, CardBaseProps>;
type CardComponent = <C extends ElementType = "div">(
  props: CardProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

export const Card = forwardRef(function Card<C extends ElementType = "div">(
  {
    as,
    variant = "elevated",
    interactive = false,
    pressable = false,
    rounded = "2xl",
    padding = "md",
    shadow = "none",
    bordered,
    className,
    children,
    ...rest
  }: CardProps<C>,
  ref: React.Ref<any>
) {
  const Component = (as ?? "div") as ElementType;

  const base = variantBase(variant);
  const radius = radiusMap[rounded];
  const extraShadow = variant === "elevated" ? "" : shadowMap[shadow];
  const borderMaybe = bordered ? "border border-neutral-200 dark:border-neutral-800" : "";
  const interactiveCls = interactive ? `${interactiveBase} hover:-translate-y-0.5` : "";
  const pressCls = pressable ? "active:scale-[0.98]" : "";

  // Width/responsiveness should be controlled from parent via className (e.g., w-full, sm:w-1/2, etc.)
  const cls = twMerge(
    "group overflow-hidden",
    base,
    radius,
    extraShadow,
    borderMaybe,
    interactiveCls,
    pressCls,
    className
  );

  return (
    <Component ref={ref} className={cls} {...rest}>
      {children}
    </Component>
  );
}) as CardComponent;

/** ---------------- Slots ---------------- */
export function CardMedia({
  src,
  alt = "",
  ratio = "16/9",
  className,
  children,
}: {
  src?: string;
  alt?: string;
  /** Any valid CSS aspect-ratio value, e.g. "1/1", "4/3", "16/9" */
  ratio?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        children
      )}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  bleed = false,
}: {
  className?: string;
  children?: React.ReactNode;
  /** If true, removes side padding to align with Card edge (great after media) */
  bleed?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex items-start gap-3",
        bleed ? "px-0 pt-0 pb-0" : "px-4 pt-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <h3 className={twMerge("text-lg font-semibold tracking-tight", className)}>{children}</h3>
  );
}

export function CardSubtitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <p className={twMerge("text-sm text-neutral-600 dark:text-neutral-400", className)}>{children}</p>;
}

export function CardContent({
  className,
  padding = "md",
  children,
}: {
  className?: string;
  padding?: Padding;
  children?: React.ReactNode;
}) {
  return <div className={twMerge(padMap[padding], "pt-3", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  align = "between",
}: {
  className?: string;
  children?: React.ReactNode;
  /** "start" | "center" | "end" | "between" */
  align?: "start" | "center" | "end" | "between";
}) {
  const alignMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  } as const;

  return (
    <div className={twMerge("px-4 pb-4 pt-2 flex items-center gap-3", alignMap[align], className)}>
      {children}
    </div>
  );
}
