const formatCep = (cep: string) => {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const formatPhone = (phone: string) => {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const formatAddress = (address: {
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{address.recipientName}</span>
      </div>
      <div className="text-sm text-gray-600">
        {address.street}, {address.number}
        {address.complement && `, ${address.complement}`}
      </div>
      <div className="text-sm text-gray-600">
        {address.neighborhood}, {address.city} - {address.state}
      </div>
      <div className="text-sm text-gray-600">
        CEP: {formatCep(address.zipCode)} | Tel: {formatPhone(address.phone)}
      </div>
    </div>
  );
};
