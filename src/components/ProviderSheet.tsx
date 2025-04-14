import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Provider } from "@/types";
import { Button } from "./ui/button";

interface ProviderSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  provider: Provider;
}

export function ProviderSheet({
  isOpen,
  setIsOpen,
  provider,
}: ProviderSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>More details about {provider.name}</SheetTitle>
          <SheetDescription className="flex flex-col">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium py-2">Languages:</td>
                  <td className="py-2">{provider.languages.join(", ")}</td>
                </tr>
                <tr>
                  <td className="font-medium">Education:</td>
                  <td className="py-2">{provider.education}</td>
                </tr>
                <tr>
                  <td className="font-medium">Hospital affiliations:</td>
                  <td className="py-2">
                    {provider.hospitalAffiliations.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Accepting new patients:</td>
                  <td className="py-2">
                    {provider.acceptingNewPatients ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Telehealth available:</td>
                  <td className="py-2">{provider.telehealth ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
            <Button
              className="cursor-pointer my-4"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
