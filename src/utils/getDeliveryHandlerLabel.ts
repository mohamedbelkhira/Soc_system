import {
  DeliveryHandler,
  DeliveryHandlerType,
} from "@/types/deliveryHandler.dto";

export default function getDeliveryHandlerLabel(
  deliveryHandler: DeliveryHandler
) {
  console.log({ deliveryHandler });

  switch (deliveryHandler.type) {
    case DeliveryHandlerType.AGENCY:
      return deliveryHandler.agency ? deliveryHandler.agency.name : "-";
    case DeliveryHandlerType.EMPLOYEE:
      return deliveryHandler.employee
        ? deliveryHandler.employee.firstName +
            " " +
            deliveryHandler.employee.lastName
        : "-";
    default:
      return "-";
  }
}
