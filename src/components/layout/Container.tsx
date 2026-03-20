import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
