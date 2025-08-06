import Input from "./Input";

const Textarea = (props: React.ComponentPropsWithoutRef<"textarea">) => {
  return <Input as="textarea" {...props} />;
};

export default Textarea;
