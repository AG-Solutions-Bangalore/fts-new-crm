import React, { useMemo } from "react";

const CustomPivotTable = ({ data }) => {
  const groupedData = useMemo(() => {
    const result = {};
    data.forEach((item) => {
      const year = item.receipt_financial_year;
      const donationType = item.receipt_donation_type;
      const amount = item.receipt_total_amount;

      if (!result[year]) {
        result[year] = {};
      }

      if (!result[year][donationType]) {
        result[year][donationType] = 0;
      }

      result[year][donationType] += amount;
    });

    return result;
  }, [data]);

  const donationTypes = useMemo(() => {
    const types = new Set();
    data.forEach((item) => {
      types.add(item.receipt_donation_type);
    });
    return Array.from(types);
  }, [data]);

  const financialYearLabel =
    data.length > 0
      ? Object.keys(data[0]).find((key) => key === "receipt_financial_year")
        ? "Financial Year"
        : "Financial Year"
      : "Financial Year";

  return (
    <table
      border="1"
      style={{
        width: "100%",
        textAlign: "left",
        borderCollapse: "collapse", // Collapse borders into single lines
      }}
    >
      <thead  className="bg-gray-200">
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            {financialYearLabel.replace(/_/g, " ")}
          </th>
          {donationTypes.map((type, index) => (
            <th
              key={index}
              style={{ border: "1px solid black", padding: "8px" }}
            >
              {type}
            </th>
          ))}
          <th style={{ border: "1px solid black", padding: "8px" }}>
            Grand Total
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedData).map((year) => (
          <tr key={year}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {year}
            </td>
            {donationTypes.map((type, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {groupedData[year][type] ? groupedData[year][type] : 0}
              </td>
            ))}
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {Object.values(groupedData[year]).reduce(
                (total, amount) => total + amount,
                0
              )}
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <td style={{ border: "1px solid black", padding: "8px" }}>
            <strong>Grand Total:</strong>
          </td>
          {donationTypes.map((type, index) => {
            const totalForType = Object.keys(groupedData).reduce(
              (total, year) => {
                return total + (groupedData[year][type] || 0);
              },
              0
            );
            return (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                <strong>{totalForType}</strong>
              </td>
            );
          })}
          <td style={{ border: "1px solid black", padding: "8px" }}>
            <strong>
              {Object.values(groupedData).reduce(
                (grandTotal, donationTypes) =>
                  grandTotal +
                  Object.values(donationTypes).reduce(
                    (total, amount) => total + amount,
                    0
                  ),
                0
              )}
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default CustomPivotTable;
