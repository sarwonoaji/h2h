import React from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  thStyle?: React.CSSProperties;
  tdStyle?: React.CSSProperties;
}

interface HeaderAction {
  label: React.ReactNode; // 🔥 support icon
  variant?: string;
  route?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface CustomTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  headerActions?: HeaderAction[];

  containerStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  actionContainerStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties | ((row: T) => React.CSSProperties);
  className?: string;

  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
}

function CustomTable<T extends { id?: string | number }>({
  title,
  columns,
  data,
  headerActions = [],

  containerStyle,
  headerStyle,
  titleStyle,
  actionContainerStyle,
  tableStyle,
  rowStyle,
  className,

  striped = true,
  bordered = true,
  hover = true,
  responsive = true,
}: CustomTableProps<T>) {
  const navigate = useNavigate();

  return (
    <div
      className={className}
      style={{
        background: "#fff",
        padding: 20,
        border: "1px solid #eee",
        ...containerStyle,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          ...headerStyle,
        }}
      >
        <h3 style={{ margin: 0, ...titleStyle }}>{title}</h3>

        <div
          style={{
            display: "flex",
            gap: 8,
            ...actionContainerStyle,
          }}
        >
          {headerActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "primary"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                ...action.style,
              }}
              onClick={() => {
                if (action.route) navigate(action.route);
                if (action.onClick) action.onClick();
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <Table
        striped={striped}
        bordered={bordered}
        hover={hover}
        responsive={responsive}
        style={tableStyle}
      >
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={col.thStyle}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={
                  typeof rowStyle === "function"
                    ? rowStyle(row)
                    : rowStyle
                }
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={col.tdStyle}>
                    {col.render
                      ? col.render(row, rowIndex)
                      : String(row[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                Data tidak tersedia
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default CustomTable;