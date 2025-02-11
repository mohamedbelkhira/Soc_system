
export enum DeliveryHandlerType {
    EMPLOYEE = 'EMPLOYEE',
    AGENCY = 'AGENCY'
  }
  
  export function getDeliveryHandlerTypeLabel(type: string): string {
    switch (type) {
      case DeliveryHandlerType.EMPLOYEE:
        return "Employé";
      case DeliveryHandlerType.AGENCY:
        return "Agence";
      default:
        return type;
    }
  }
  