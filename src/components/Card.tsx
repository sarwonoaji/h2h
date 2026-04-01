import moment from "moment";
import React, { useState, useRef, useEffect } from "react";

/* =============================
   TYPES
============================= */

interface CardProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  headerStyle?: React.CSSProperties;
  headerCustom?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
}

interface BaseFieldProps {
  label: React.ReactNode;
  name: string;
  value?: string | number | null;
  readonly?: boolean;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  className?: string;
  error?: string;
  errorStyle?: React.CSSProperties;
  errorClassName?: string;
  showError?: boolean;
}

interface InputProps extends BaseFieldProps {
  onlyNumber?: boolean;
  maxLength?: number;
  type?: string;
  onChange?: (value: string) => void;
}

interface SelectProps extends BaseFieldProps {
  list: { label: string; value: string | number }[];
  sliceList?: number;
  onChange?: (value: string | number) => void;
}

interface TextareaProps extends BaseFieldProps {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface NumericProps extends BaseFieldProps {
  labelUnit?: React.ReactNode;
  value?: string | number | null;
  typeChanges?: "number" | "string";
  step?: number;
  onChange?: (value: number | string | null) => void;
}

interface DatePickerProps extends BaseFieldProps {
  onChange?: (date: Date | null) => void;
}

interface CardComponent extends React.FC<CardProps> {
  Input: React.FC<InputProps>;
  Select: React.FC<SelectProps>;
  Textarea: React.FC<TextareaProps>;
  Numeric: React.FC<NumericProps>;
  DatePicker: React.FC<DatePickerProps>;
}
/* =============================
   MAIN CARD
============================= */

const Card: CardComponent = ({ title, headerCustom, children, style, className, headerStyle, bodyStyle }) => {
  return (
    <div style={{ ...styles.card, ...style }} className={className}>
      {title && (
        <div
          style={{
            ...styles.header,
            ...headerStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, fontFamily: "inherit" }}>{title}</h3>
          {headerCustom && <div>{headerCustom}</div>}
        </div>
      )}
      <div style={{ ...styles.body, ...bodyStyle }}>{children}</div>
    </div>
  );
};

/* =============================
   INPUT
============================= */

const CardInput: React.FC<InputProps> = ({
  label,
  name,
  value,
  type = "text",
  readonly = false,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  error,
  onlyNumber = false,
  maxLength,
  errorStyle,
  errorClassName,
  showError = true,
}) => {
  const isError = !!error;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (onlyNumber) {
      val = val.replace(/[^0-9]/g, "");
    }

    if (maxLength) {
      val = val.slice(0, maxLength);
    }

    onChange?.(val); // ⬅ kirim value saja
  };
  return (
    <div style={{ ...styles.formGroup, ...containerStyle }}>
      <label style={{ ...styles.label, ...labelStyle }}>{label}</label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        readOnly={readonly}
        onChange={handleChange}
        className={className}
        inputMode={onlyNumber ? "numeric" : "text"}
        pattern={onlyNumber ? "[0-9]*" : undefined}
        style={{
          ...styles.input,
          border: isError ? "1px solid #d32f2f" : "1px solid #ccc",
          backgroundColor: readonly ? "#f5f5f5" : "#fff",
          ...inputStyle,
        }}
      />

      {isError && showError && (
        <span
          className={errorClassName}
          style={{ ...styles.errorText, ...errorStyle }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

/* =============================
   CUSTOM SEARCHABLE SELECT
============================= */

const CardSelect: React.FC<SelectProps> = ({
  label,
  name,
  value,
  list,
  sliceList = 10, // default slice list to 10 items
  readonly = false,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  error,
  errorStyle,
  errorClassName,
  showError = true,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isError = !!error;

  const selectedLabel =
    list.find((item) => item.value === value)?.label || "";

  const filteredList = search
  ? list.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    )
  : list.slice(0, sliceList);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ ...styles.formGroup, ...containerStyle }} ref={wrapperRef}>
      <label style={{ ...styles.label, ...labelStyle }}>{label}</label>

      <div style={{ ...styles.selectWrapper, border: isError ? "1px solid #d32f2f" : "1px solid #ccc" }} className={className}>
        <input
          name={name}
          value={open ? search : selectedLabel}
          readOnly={readonly}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onClick={() => !readonly && setOpen(!open)}
          className={className}
          style={{
            ...styles.input,
            paddingRight: "70px",
            backgroundColor: readonly ? "#f5f5f5" : "#fff",
            cursor: readonly ? "not-allowed" : "pointer",
            ...inputStyle,
          }}
        />

        <div style={styles.iconContainer}>
          {/* RESET */}
          <span
            style={{
              ...styles.icon,
              opacity: value && !readonly ? 1 : 0,
              pointerEvents: value && !readonly ? "auto" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
              setSearch("");
            }}
          >
            ✕
          </span>

          <div style={styles.divider} />

          {/* ARROW */}
          <span
            style={styles.icon}
            onClick={(e) => {
              e.stopPropagation();
              if (!readonly) setOpen(!open);
            }}
          >
            {open ? "▲" : "▼"}
          </span>
        </div>

        {open && !readonly && (
          <div style={styles.dropdown}>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <div
                  key={item.value}
                  style={styles.option}
                  onClick={() => {
                    onChange?.(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div style={styles.noData}>Tidak ditemukan</div>
            )}
          </div>
        )}
      </div>

      {isError && showError && (
        <span
          className={errorClassName}
          style={{ ...styles.errorText, ...errorStyle }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

/* =============================
   CUSTOM TEXTAREA
============================= */
const CardTextarea: React.FC<TextareaProps> = ({
  label,
  name,
  value,
  readonly = false,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  error,
  errorStyle,
  errorClassName,
  showError = true,
}) => {
  const isError = !!error;

  return (
    <div style={{ ...styles.formGroup, ...containerStyle }}>
      <label style={{ ...styles.label, ...labelStyle }}>{label}</label>
      <textarea
        name={name}
        value={ value ?? "" }
        readOnly={readonly}
        onChange={onChange}
        className={className}
        style={{
          ...styles.input,
          height: 100,
          border: isError ? "1px solid #d32f2f" : "1px solid #ccc",
          backgroundColor: readonly ? "#f5f5f5" : "#fff",
          ...inputStyle,
        }}
      />
      {isError && showError && (
        <span
          className={errorClassName}
          style={{ ...styles.errorText, ...errorStyle }}
        >
          {error}
        </span> 
      )}
    </div>
  );
}
/* =============================
   CUSTOM NUMERIC INPUT
============================= */
const CardNumeric: React.FC<NumericProps> = ({
  label,
  name,
  value,
  readonly = false,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  error,
  errorStyle,
  errorClassName,
  showError = true,
  typeChanges = "number",
  labelUnit="",
  step,
}) => {
  const isError = !!error;
  const normalizedValue =
    typeof value === "string" && value !== ""
      ? Number(value)
      : value ?? "";
  return (
    <div style={{ ...styles.formGroup, ...containerStyle }}>
      <label style={{ ...styles.label, ...labelStyle }}>{label}</label>
      <div style={{ position: "relative", display:"flex", flexDirection:"row", 
        border: isError ? "1px solid #d32f2f" :"1px solid #ccc",
        backgroundColor: readonly ? "#f5f5f5" : "#fff",
       }}>
      <input
        type="number"
        name={name}
        value={normalizedValue}
        readOnly={readonly}
        step={step}
        onChange={(e) => {
          const raw = e.target.value;

          if (typeChanges === "number") {
            onChange?.(raw === "" ? 0 : Number(raw));
          } else {
            onChange?.(raw);
          }
        }}
        className={className}
        style={{
          ...styles.input,
          backgroundColor: readonly ? "#f5f5f5" : "#fff",
          borderRight: labelUnit ? "1px solid #ccc" : "1px solid transparent",
          ...inputStyle,
        }}
      />
      {labelUnit && (
      <div style={{ height: "inherit", display: "flex", justifyContent: "center", alignItems: "center", padding:"0 8px"}}>{labelUnit}</div>
      )}
      </div>
      
      {isError && showError && (
        <span
          className={errorClassName}
          style={{ ...styles.errorText, ...errorStyle }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

/* =============================
   CUSTOM DATE PICKER
============================= */
const CardDatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  readonly = false,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  error,
  errorStyle,
  errorClassName,
  showError = true,
}) => {
  const isError = !!error;

  return (
    <div style={{ ...styles.formGroup, ...containerStyle }}>
      <label style={{ ...styles.label, ...labelStyle }}>{label}</label>
      <input
        type="date"
        name={name}
        value={ value ? moment(value).format("YYYY-MM-DD") : "" }
        readOnly={readonly}
        onChange={(e) => onChange?.(e.target.value ? new Date(e.target.value) : null)}
        className={className}
        style={{
          ...styles.input,
          border: isError ? "1px solid #d32f2f" : "1px solid #ccc",
          backgroundColor: readonly ? "#f5f5f5" : "#fff",
          ...inputStyle,
        }}
      />
      {isError && showError && (
        <span
          className={errorClassName}
          style={{ ...styles.errorText, ...errorStyle }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

Card.Input = CardInput;
Card.Select = CardSelect;
Card.Textarea = CardTextarea;
Card.Numeric = CardNumeric;
Card.DatePicker = CardDatePicker;
/* =============================
   STYLES
============================= */

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "100%",
    border: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontSize: "12px",
  },
  header: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#f7f7f7",
  },
  body: {
    padding: "12px",
  },
  formGroup: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    marginBottom: "4px",
    fontWeight: 500,
  },
  input: {
    fontFamily: "inherit",
    width: "100%",
    padding: "8px 10px",
    border: "none",
    fontSize: "12px",
    outline: "none",
  },

  selectWrapper: {
    position: "relative",
  },

  iconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    gap: "8px",
  },

  divider: {
    width: "1px",
    height: "60%",
    backgroundColor: "#ccc",
  },

  icon: {
    fontSize: "12px",
    cursor: "pointer",
    color: "#555",
    display: "flex",
    alignItems: "center",
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderTop: "none",
    zIndex: 1000,
  },

  option: {
    padding: "8px 10px",
    cursor: "pointer",
  },

  noData: {
    padding: "8px 10px",
    color: "#888",
  },

  errorText: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#d32f2f",
  },
};

export default Card;