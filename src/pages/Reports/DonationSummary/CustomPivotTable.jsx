import React, { useMemo } from "react";

const CustomPivotTable = ({ data }) => {
  const groupedData = useMemo(() => {
    const result = {};
    data.forEach((item) => {
      const year = item.chapter_name;
      const donationType = item.receipt_donation_type;
      const amount = item.receipt_total_amount;
      const donationCount = item.total_count;
      const otsCount = item.receipt_no_of_ots;

      if (!result[year]) {
        result[year] = {};
      }

      if (!result[year][donationType]) {
        result[year][donationType] = {
          totalAmount: 0,
          donationCount: 0,
          otsCount: 0,
        };
      }

      result[year][donationType].totalAmount += amount;
      result[year][donationType].donationCount += donationCount;
      result[year][donationType].otsCount += parseInt(otsCount, 10);
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

  // Calculate grand totals for the footer
  const grandTotalDonations = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.donationCount,
        0
      )
    );
  }, 0);

  const grandTotalOTS = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.otsCount,
        0
      )
    );
  }, 0);

  const grandTotalAmount = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.totalAmount,
        0
      )
    );
  }, 0);

  return (
    <table
      border="1"
      style={{
        width: "100%",
        textAlign: "left",
        borderCollapse: "collapse",
      }}
    >
      <thead className="bg-gray-200 text-xs">
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            {financialYearLabel.replace(/_/g, " ")}
          </th>

          {donationTypes.map((type, index) => (
            <th
              key={index}
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {type}
            </th>
          ))}

          <th
            style={{
              border: "1px solid black",
              padding: "8px",
              textAlign: "center",
              verticalAlign: "middle",
            }}
            colSpan={3}
          >
            Grand Total
          </th>
        </tr>

        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}></th>

          {donationTypes.map((type, index) => (
            <React.Fragment key={index} className="text-xs">
              <th style={{ border: "1px solid black", padding: "8px" }}>
                No of Donation
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                No of OTS
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Amount
              </th>
            </React.Fragment>
          ))}
          <th style={{ border: "1px solid black", padding: "8px" }}>
            No of Donation
          </th>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            No of OTS
          </th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
        </tr>
      </thead>

      <tbody className="text-xs">
        {Object.keys(groupedData).map((year) => (
          <tr key={year}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {year}
            </td>
            {donationTypes.map((type, index) => (
              <React.Fragment key={index}>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  {groupedData[year][type]?.donationCount || 0}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  {groupedData[year][type]?.otsCount || 0}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  {groupedData[year][type]?.totalAmount || 0}
                </td>
              </React.Fragment>
            ))}

            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "right",
              }}
            >
              {grandTotalDonations}
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "right",
              }}
            >
              {grandTotalOTS}
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "right",
              }}
            >
              {grandTotalAmount}
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot className="text-xs">
        <tr>
          <td
            style={{
              border: "1px solid black",
              padding: "8px",
              textAlign: "left",
            }}
          >
            <strong>Grand Total:</strong>
          </td>
          {donationTypes.map((type, index) => {
            const totalDonationsForType = Object.keys(groupedData).reduce(
              (total, year) =>
                total + (groupedData[year][type]?.donationCount || 0),
              0
            );
            const totalOTSForType = Object.keys(groupedData).reduce(
              (total, year) => total + (groupedData[year][type]?.otsCount || 0),
              0
            );
            const totalAmountForType = Object.keys(groupedData).reduce(
              (total, year) =>
                total + (groupedData[year][type]?.totalAmount || 0),
              0
            );

            return (
              <React.Fragment key={index}>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  <strong>{totalDonationsForType}</strong>
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  <strong>{totalOTSForType}</strong>
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  <strong>{totalAmountForType}</strong>
                </td>
              </React.Fragment>
            );
          })}

          <td
            style={{
              border: "1px solid black",
              padding: "8px",
              textAlign: "right",
            }}
          >
            <strong>{grandTotalDonations}</strong>
          </td>
          <td
            style={{
              border: "1px solid black",
              padding: "8px",
              textAlign: "right",
            }}
          >
            <strong>{grandTotalOTS}</strong>
          </td>
          <td style={{ border: "1px solid black", padding: "8px",
                    textAlign: "right", }}>
            <strong>{grandTotalAmount}</strong>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default CustomPivotTable;
