import { useState } from "react";
import { RibbonLotDetailsModal } from "./ribbon-lot-details-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RibbonLot } from "@/types/ribbon-lot";

interface RibbonLotTableProps {
  lots: RibbonLot[];
  onEdit: (lot: RibbonLot) => void;
  onDelete: (id: string) => void;
  onView: (lot: RibbonLot) => void;
}

export function RibbonLotTable({ lots, onEdit, onDelete, onView }: RibbonLotTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<(RibbonLot & { imageBase64?: string }) | null>(null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'resolved':
        return 'bg-success/10 text-success border border-success/20';
      case 'pending':
        return 'status-warning';
      default:
        return 'status-inactive';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'resolved':
        return 'Resolvido';
      case 'pending':
        return 'Pendente';
      default:
        return 'Inativo';
    }
  };

  return (
    <div className="rounded-lg border shadow-card bg-white dark:bg-[#24284B] dark:border-[#24284B] border-[#e5e7eb] dark:shadow-none overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="font-semibold text-foreground">ID</TableHead>
              <TableHead className="font-semibold text-foreground">LOTE</TableHead>
              <TableHead className="font-semibold text-foreground">DATA/HORA</TableHead>
              <TableHead className="font-semibold text-foreground">TURNO</TableHead>
              <TableHead className="font-semibold text-foreground">MODELO</TableHead>
              <TableHead className="font-semibold text-foreground">QTD</TableHead>
              <TableHead className="font-semibold text-foreground">PROBLEMA</TableHead>
              <TableHead className="font-semibold text-foreground">STATUS</TableHead>
              <TableHead className="font-semibold text-foreground w-[100px]">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p>Nenhum problema registrado ainda</p>
                    <p className="text-sm">Clique em "Cadastrar Problema" para começar</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lots.map((lot) => (
                <TableRow key={lot.id} className="table-row">
                  <TableCell className="font-mono text-sm">#{lot.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-mono font-semibold text-primary">{lot.lotNumber}</TableCell>
                  <TableCell className="font-mono text-sm">
                    <div>
                      <div>{lot.date}</div>
                      <div className="text-muted-foreground text-xs">{lot.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border">
                      {lot.shift}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{lot.ribbonModel}</TableCell>
                  <TableCell className="text-center font-mono">{lot.quantity}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={lot.problem}>
                    {lot.problem}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusVariant(lot.status)}>
                      {getStatusText(lot.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs border-blue-300 text-blue-900 bg-white/30 hover:bg-blue-50 dark:bg-[#24284B] dark:text-blue-100 dark:border-[#4D519A]"
                      onClick={() => {
                        setSelectedLot(lot as any);
                        setDetailsOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-border bg-popover">
                        <DropdownMenuItem 
                          onClick={() => onEdit(lot)}
                          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(lot.id)}
                          className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <RibbonLotDetailsModal
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open);
            if (!open) setSelectedLot(null);
          }}
          lot={selectedLot}
        />
      </div>
    </div>
  );
}