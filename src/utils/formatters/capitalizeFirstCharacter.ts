export default function capitalizeFirstCharacter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
