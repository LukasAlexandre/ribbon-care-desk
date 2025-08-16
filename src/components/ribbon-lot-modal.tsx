import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Clock } from "lucide-react";
import { RibbonLotFormData } from "@/types/ribbon-lot";

type RibbonLotFormDataWithImage = RibbonLotFormData & { imageBase64?: string };

export interface RibbonLotModalProps {
  onSubmit: (data: RibbonLotFormDataWithImage) => void;
  lotToEdit?: RibbonLotFormDataWithImage | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RibbonLotModal({ onSubmit, lotToEdit, open: controlledOpen, onOpenChange }: RibbonLotModalProps) {
  const [open, setOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;
  const setActualOpen = isControlled && onOpenChange ? onOpenChange : setOpen;
  const [formData, setFormData] = useState<RibbonLotFormData>({
    shift: 'ADM',
    ribbonModel: '',
    quantity: 0,
    problem: '',
    lotNumber: '',
    details: ''
  });
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);

  // Preencher dados ao editar
  useEffect(() => {
    if (lotToEdit && actualOpen) {
      setFormData({
        shift: lotToEdit.shift,
        ribbonModel: lotToEdit.ribbonModel,
        quantity: lotToEdit.quantity,
        problem: lotToEdit.problem,
        lotNumber: lotToEdit.lotNumber,
        details: lotToEdit.details,
      });
      setImageBase64(lotToEdit.imageBase64);
    } else if (!actualOpen) {
      setFormData({
        shift: 'ADM',
        ribbonModel: '',
        quantity: 0,
        problem: '',
        lotNumber: '',
        details: ''
      });
      setImageBase64(undefined);
    }
  }, [lotToEdit, actualOpen]);

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageBase64 });
    setFormData({
      shift: 'ADM',
      ribbonModel: '',
      quantity: 0,
      problem: '',
      lotNumber: '',
      details: ''
    });
    setImageBase64(undefined);
    setActualOpen(false);
  };

  // Função para converter imagem em base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64(undefined);
    }
  };

  const handleInputChange = (field: keyof RibbonLotFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={actualOpen} onOpenChange={setActualOpen}>
      {!lotToEdit && (
        <DialogTrigger asChild>
          <Button
            className="font-semibold border border-[color:hsl(var(--border))] transition-colors
              bg-white text-[color:#24284B]
              hover:bg-[color:#f4f4fa] hover:text-[color:#24284B]
              dark:gradient-primary dark:text-white dark:border-0 dark:hover:opacity-90 shadow-elegant"
          >
            <Plus className="h-4 w-4 mr-2 dark:text-white text-[color:#24284B]" />
            Cadastrar Problema
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] shadow-card bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            {lotToEdit ? 'Editar Registro do Ribbon' : 'Registrar Problema do Ribbon'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data e Hora Automáticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Data
              </Label>
              <Input 
                value={currentDate} 
                disabled 
                className="bg-muted/50 border-border font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Hora
              </Label>
              <Input 
                value={currentTime} 
                disabled 
                className="bg-muted/50 border-border font-mono"
              />
            </div>
          </div>

          {/* Turno */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Turno *</Label>
            <Select 
              value={formData.shift} 
              onValueChange={(value: 'ADM' | '2°Turno') => handleInputChange('shift', value)}
            >
              <SelectTrigger className="border-border hover:border-ring transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADM">Turno ADM</SelectItem>
                <SelectItem value="2°Turno">2° Turno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modelo do Ribbon */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Modelo do Ribbon *</Label>
            <Input
              value={formData.ribbonModel}
              onChange={(e) => handleInputChange('ribbonModel', e.target.value)}
              placeholder="Ex: R-500, R-1000..."
              className="border-border hover:border-ring transition-colors"
              required
            />
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Quantidade de Ribbons *</Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="1"
              className="border-border hover:border-ring transition-colors"
              required
            />
          </div>

          {/* Problema */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Problema *</Label>
            <Input
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              placeholder="Descreva o problema encontrado"
              className="border-border hover:border-ring transition-colors"
              required
            />
          </div>

          {/* LOTE - O Mais Importante */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              LOTE * (Campo Principal)
            </Label>
            <Input
              value={formData.lotNumber}
              onChange={(e) => handleInputChange('lotNumber', e.target.value)}
              placeholder="LOTE N°: 000000"
              className="border-primary/50 focus:border-primary bg-primary/5 font-mono text-lg"
              required
            />
          </div>


          {/* Detalhes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Detalhes Adicionais</Label>
            <Textarea
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Informações adicionais sobre o problema..."
              className="border-border hover:border-ring transition-colors min-h-[80px] resize-none"
            />
          </div>

          {/* Anexo de Foto */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Anexo de Foto (opcional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border-border hover:border-ring transition-colors"
            />
            {imageBase64 && (
              <img src={imageBase64} alt="Pré-visualização" className="mt-2 max-h-32 rounded shadow" />
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => (typeof setActualOpen === 'function' ? setActualOpen(false) : setOpen(false))}
              className="border-border hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="gradient-primary hover:opacity-90 shadow-elegant text-white font-semibold"
            >
              {lotToEdit ? 'Salvar Alterações' : 'Registrar Problema'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  );
}
