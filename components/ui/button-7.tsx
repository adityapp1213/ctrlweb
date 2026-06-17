import { Button } from "@/components/ui/button";

type Button7Props = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Button7 = ({
  children = "Waitlist",
  className = "",
  onClick,
}: Button7Props) => {
  return (
    <Button size="lg" onClick={onClick} className={className}>
      {children}
    </Button>
  );
};

export default Button7;
