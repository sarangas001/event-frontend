type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const gradients = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
];

const Avatar = ({ name, size = "sm" }: AvatarProps) => {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const gradient = gradients[name.charCodeAt(0) % gradients.length];
  const dimensions = size === "lg" ? "h-12 w-12 text-sm" : size === "md" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";

  return (
    <div className={`${dimensions} flex-shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white`}>
      {initials}
    </div>
  );
};

export default Avatar;
