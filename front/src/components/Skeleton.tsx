import clsx from "clsx";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx("bg-gray-200 animate-pulse rounded-md", className)}
      {...props}
    />
  );
};
