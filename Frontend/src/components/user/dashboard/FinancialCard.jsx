import React from "react";
import { Card, Typography } from "antd";
import { BsCurrencyRupee } from "react-icons/bs";

const FinancialCard = ({ label, value }) => {
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{
        borderRadius: 6,
        overflow: "hidden",
        background: "#f5f5f5",
        height: 80,
        display: "flex",
        flexDirection: "row",
        boxShadow: "none",
        border: "none",
      }}
    >
      {/* Left pink side */}
      <div
        style={{
          backgroundColor: "#EAA9DF",
          width: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          height: "100%",
        }}
      >
        <BsCurrencyRupee size={32} color="#fff" />
      </div>

      {/* Right side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "14px 18px",
          height: "100%",
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: 13, color: "#999" }}>
          {(label || "").toUpperCase()}
        </Typography.Text>
        <Typography.Text
          style={{
            fontSize: 24,
            color: "#8DD36F",
            fontWeight: 600,
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          {typeof value === "number"
            ? value.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : value}
        </Typography.Text>
      </div>
    </Card>
  );
};

export default FinancialCard;