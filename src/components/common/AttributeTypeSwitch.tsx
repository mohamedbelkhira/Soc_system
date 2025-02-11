import { Button } from "../ui/button";

export function AttributeTypeSwitch({
  value,
  onChange,
}: {
  value: "STRING" | "NUMBER";
  onChange: (value: "STRING" | "NUMBER") => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={value === "NUMBER"}
        onChange={(e) => onChange(e.target.checked ? "NUMBER" : "STRING")}
        className="sr-only peer"
      />
      <div className="flex p-1 bg-secondary rounded-md">
        <Button
          type="button"
          size={"sm"}
          variant={value === "STRING" ? "default" : "ghost"}
          className="w-24"
          onClick={() => {
            onChange("STRING");
          }}
        >
          Texte
        </Button>
        <Button
          type="button"
          size={"sm"}
          variant={value === "NUMBER" ? "default" : "ghost"}
          className="w-24"
          onClick={() => {
            onChange("NUMBER");
          }}
        >
          Nombre
        </Button>
      </div>
    </div>
  );
}
