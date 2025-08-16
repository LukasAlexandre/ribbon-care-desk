import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RibbonLot } from "@/types/ribbon-lot";
import { Image } from "lucide-react";

interface RibbonLotDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot: (RibbonLot & { imageBase64?: string }) | null;
}

export function RibbonLotDetailsModal({ open, onOpenChange, lot }: RibbonLotDetailsModalProps) {
  if (!lot) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#24284B] border border-border shadow-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[color:#24284B] dark:text-white flex items-center gap-2">
            <Image className="h-6 w-6 text-[#4D519A] dark:text-blue-100" />
            Detalhes do Registro
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">ID:</span> <span className="font-mono">#{lot.id.slice(0,8)}</span>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Lote:</span> <span className="font-mono">{lot.lotNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Data/Hora:</span> <span className="font-mono">{lot.date} {lot.time}</span>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Turno:</span> <Badge variant="outline" className="border-border">{lot.shift}</Badge>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Modelo:</span> <span className="font-semibold">{lot.ribbonModel}</span>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Quantidade:</span> <span className="font-mono">{lot.quantity}</span>
            </div>
            <div>
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Status:</span> <Badge className="ml-1">{lot.status}</Badge>
            </div>
          </div>
          <div>
            <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Problema:</span>
            <div className="mt-1 text-[color:#24284B] dark:text-white">{lot.problem}</div>
          </div>
          <div>
            <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Detalhes:</span>
            <div className="mt-1 text-[color:#24284B] dark:text-white">{lot.details || <span className="italic text-muted-foreground">(Sem detalhes)</span>}</div>
          </div>
          {lot.imageBase64 && (
            <div className="mt-4">
              <span className="font-semibold text-[color:#4D519A] dark:text-blue-100">Anexo:</span>
              <img src={lot.imageBase64} alt="Anexo" className="mt-2 max-h-48 rounded shadow" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
