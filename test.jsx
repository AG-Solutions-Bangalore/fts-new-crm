const AddressDisplay = ({ title, address }) => (
    <div className="space-y-2">
      <h6 className="text-sm font-medium text-gray-600">{title}</h6>
      <div className="text-sm text-gray-900 leading-relaxed">
        {address ? (
          <div className="space-y-1">
            {address.address ? (
              <>
                <p>{address.address}</p>
                <p>{address.area}{address.landmark && `, ${address.landmark}`}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
              </>
            ) : address.city ? (
              <p>{address.city}, {address.state} - {address.pincode}</p>
            ) : (
              <p>Address not available</p>
            )}
          </div>
        ) : (
          <p>Address not available</p>
        )}
      </div>
    </div>
  );
  