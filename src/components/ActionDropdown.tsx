import React from "react";
import { Dropdown } from "react-bootstrap";

// ==============================
// Types
// ==============================
export type ActionItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type ActionDropdownProps = {
  actions: ActionItem[];
  label?: React.ReactNode; // optional custom toggle content
};

// ==============================
// Custom Toggle (TS Safe)
// ==============================
const CustomToggle = React.forwardRef<
  HTMLSpanElement,
  {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
  }
>(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}
    style={{
      cursor: "pointer",
      padding: "6px 10px",
      display: "inline-flex",
      alignItems: "center",
      fontSize: 12,
      borderRadius: 0
    }}
  >
    {children}
  </span>
));

CustomToggle.displayName = "CustomToggle";

// ==============================
// Component
// ==============================
const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actions,
  label = "Action", // default toggle text
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" style={{ borderRadius: 0, minWidth: 120, padding: "4px 0" }}>
        {actions.map((action, index) => (
          <Dropdown.Item
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "4px 12px" }}
          >
            {action.icon}
            {action.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActionDropdown;