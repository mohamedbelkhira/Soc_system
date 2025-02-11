import { Client } from "@/types/clients/client.dto";

export default function getClientLabel(client: Client) {
  return `${client.firstName} ${client.lastName}  ${client.phoneNumber && "| " + client.phoneNumber}`;
}
