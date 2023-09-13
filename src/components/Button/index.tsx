type ButtonProps = {
  content?: string;
  onClick?: any;
};

const Button = ({ content, onClick }: ButtonProps) => {
  return <button className="btn">{content}</button>;
};

export default Button;
