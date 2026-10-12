import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Junta classes do Tailwind resolvendo conflitos (ex.: "p-2" + "p-4" => "p-4").
// Helper padrão do shadcn/ui, usado por todos os componentes em components/ui.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
