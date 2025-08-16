import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RibbonLotModal } from "@/components/ribbon-lot-modal";
import { RibbonLotTable } from "@/components/ribbon-lot-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { RibbonLot, RibbonLotFormData } from "@/types/ribbon-lot";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function RibbonLotControl() {
  const [lots, setLots] = useState<RibbonLot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [lotToEdit, setLotToEdit] = useState<any>(null);
  // Exclusão bonita
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<any>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLots = localStorage.getItem('ribbon-lots');
    if (savedLots) {
      setLots(JSON.parse(savedLots));
    }
  }, []);

  // Save to localStorage whenever lots change
  useEffect(() => {
    localStorage.setItem('ribbon-lots', JSON.stringify(lots));
  }, [lots]);

  const handleCreateLot = (formData: RibbonLotFormData & { imageBase64?: string }) => {
    const newLot: RibbonLot & { imageBase64?: string } = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      ...formData,
      status: 'active',
      createdAt: new Date(),
      imageBase64: formData.imageBase64
    };

    setLots(prev => [newLot, ...prev]);
    
    toast({
      title: "Problema Registrado!",
      description: `Lote ${formData.lotNumber} cadastrado com sucesso.`,
      className: "border-success bg-success/10"
    });
  };

  const handleEditLot = (lot: RibbonLot) => {
    setLotToEdit(lot);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    setLots(prev => prev.map(l => l.id === lotToEdit.id ? { ...l, ...data } : l));
    setEditModalOpen(false);
    setLotToEdit(null);
    toast({
      title: "Registro Atualizado!",
      description: `Lote ${data.lotNumber} atualizado com sucesso.`,
      className: "border-success bg-success/10"
    });
  };

  const handleDeleteLot = (id: string) => {
    const lot = lots.find(l => l.id === id);
    setLotToDelete(lot);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (lotToDelete) {
      setLots(prev => prev.filter(l => l.id !== lotToDelete.id));
      toast({
        title: "Registro Excluído",
        description: `Lote ${lotToDelete.lotNumber} foi removido.`,
        variant: "destructive"
      });
    }
    setDeleteModalOpen(false);
    setLotToDelete(null);
  };

  const handleViewLot = (lot: RibbonLot) => {
    toast({
      title: "Visualizar Detalhes",
      description: "Funcionalidade de visualização em desenvolvimento.",
    });
  };

  const filteredLots = lots.filter(lot =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.ribbonModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: lots.length,
    active: lots.filter(l => l.status === 'active').length,
    resolved: lots.filter(l => l.status === 'resolved').length,
    pending: lots.filter(l => l.status === 'pending').length
  };

  return (
  <div className="min-h-screen bg-background dark:bg-[#0D0B19] relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 animate-gradient-move"
        style={{
          background:
            'linear-gradient(120deg, #e5e9f7 0%, #bfc6e6 40%, #a3a8d4 70%, #f8fafc 100%)',
          backgroundSize: '250% 250%',
          opacity: 0.85,
        }}
      >
        <style>{`
          html.dark .pointer-events-none {
            background: linear-gradient(120deg, #0D0B19 0%, #24284B 40%, #604D7B 100%) !important;
          }
        `}</style>
      </div>
  {/* Header */}
  <header className="border-b bg-white dark:bg-[#0D0B19] dark:border-[#24284B] sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center shadow-elegant">
                  <TrendingUp className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold drop-shadow text-[color:#24284B] dark:text-white">
                    Controle de Lotes - Ribbon
                  </h1>
                  <p className="text-sm text-[color:#4D519A] dark:text-blue-100">
                    Sistema de Gestão de Problemas | Multilaser
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="[&>button]:bg-[#4D519A] [&>button]:text-white dark:[&>button]:bg-[#9075A0] dark:[&>button]:text-white">
                <RibbonLotModal onSubmit={handleCreateLot} />
                <RibbonLotModal
                  onSubmit={handleEditSubmit}
                  lotToEdit={lotToEdit}
                  open={editModalOpen}
                  onOpenChange={setEditModalOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

  <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Statistics Cards - Only Total and Active, Centered */}
  <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 animate-fade-in-up">
          <Card className="shadow-card min-w-[220px] animate-glow animate-fade-in bg-white dark:bg-[#24284B] dark:border-[#24284B] border border-[#e5e7eb] dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#24284B] dark:text-white">
                Total de Registros
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#4D519A] dark:text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#24284B] dark:text-white drop-shadow">{stats.total}</div>
              <p className="text-xs text-[#4D519A] dark:text-blue-100 mt-1">
                Problemas cadastrados
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card min-w-[220px] animate-glow animate-fade-in bg-white dark:bg-[#24284B] dark:border-[#24284B] border border-[#e5e7eb] dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#24284B] dark:text-white">
                Problemas Ativos
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#4D519A] dark:text-yellow-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4D519A] dark:text-yellow-100 drop-shadow">{stats.active}</div>
              <p className="text-xs text-[#4D519A] dark:text-blue-100 mt-1">
                Requerem atenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
  <Card className="shadow-card mb-8 bg-white dark:bg-[#24284B] dark:border-[#24284B] border border-[#e5e7eb] dark:shadow-none animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-900/90">
              <span className="dark:text-white">Filtros e Busca</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Buscar por lote, problema ou modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-300 bg-white/40 text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-200 transition-colors dark:text-white dark:placeholder:text-white/70"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-blue-300 text-blue-900 bg-white/30">
                  <span className="dark:text-white">{filteredLots.length} resultado(s)</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
  <Card className="shadow-card bg-white dark:bg-[#24284B] dark:border-[#24284B] border border-[#e5e7eb] dark:shadow-none animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-900/90">
              <span className="dark:text-white">Registros de Problemas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RibbonLotTable
              lots={filteredLots}
              onEdit={handleEditLot}
              onDelete={handleDeleteLot}
              onView={handleViewLot}
            />
          </CardContent>
        </Card>
      </main>
      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#24284B] border border-border shadow-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[color:#24284B] dark:text-white">
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[color:#24284B] dark:text-white">
            Tem certeza que deseja excluir o lote <b>{lotToDelete?.lotNumber}</b>?
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="border-border">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}