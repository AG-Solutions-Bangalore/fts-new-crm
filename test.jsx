<div className="flex justify-between mb-6">
  <div>
    <p className="font-bold">
      Donor Name:{" "}
      <span className="font-normal">
        {SchoolAlotReceipt?.individual_company?.indicomp_type !== "Individual"
          ? SchoolAlotReceipt?.individual_company?.indicomp_full_name
          : SchoolAlotReceipt?.individual_company?.indicomp_full_name}
      </span>
    </p>

    {SchoolAlotReceipt?.individual_company?.indicomp_type === "Individual" && (
      <p className="font-bold">
        Contact Person/Spouse:{" "}
        <span className="font-normal">{SchoolAlotReceipt?.individual_company?.indicomp_spouse_name}</span>
      </p>
    )}

    {SchoolAlotReceipt?.individual_company?.indicomp_type !== "Individual" && (
      <p className="font-bold">
        Contact Person/Spouse:{" "}
        <span className="font-normal">{SchoolAlotReceipt?.individual_company?.indicomp_com_contact_name}</span>
      </p>
    )}

    <p className="font-bold">
      Promoter:{" "}
      <span className="font-normal">{SchoolAlotReceipt?.individual_company?.indicomp_promoter}</span>
    </p>
  </div>
  <div>
    <p className="font-bold">
      No of Schools:{" "}
      {OTSReceipts.map((otsreceipt, key) => (
        <span key={key} className="font-normal">{otsreceipt.receipt_no_of_ots}</span>
      ))}
    </p>
  </div>
</div>
