import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text = "Memuat data...",
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Spinner animation="border" variant="primary" />
        <div style={{ marginTop: 12, fontWeight: 500 }}>{text}</div>
      </div>

      {/* Simple fade animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingOverlay;