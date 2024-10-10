import { Button, ButtonProps } from "@tarojs/components";

import "./index.scss";

const XButton = (props: ButtonProps) => {
  const { className = "", ...restProps } = props;

  return (
    <Button
      className={`btn-default ${className}`}
      {...restProps}
      hoverClass="btn-hover"
    >
      {props.children}
    </Button>
  );
};

export default XButton;
