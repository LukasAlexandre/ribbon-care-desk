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

export function RibbonLotControl() {
  const [lots, setLots] = useState<RibbonLot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

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

  const handleCreateLot = (formData: RibbonLotFormData) => {
    const newLot: RibbonLot = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      ...formData,
      status: 'active',
      createdAt: new Date()
    };

    setLots(prev => [newLot, ...prev]);
    
    toast({
      title: "Problema Registrado!",
      description: `Lote ${formData.lotNumber} cadastrado com sucesso.`,
      className: "border-success bg-success/10"
    });
  };

  const handleEditLot = (lot: RibbonLot) => {
    toast({
      title: "Editar Registro",
      description: "Funcionalidade de edição em desenvolvimento.",
    });
  };

  const handleDeleteLot = (id: string) => {
    const lot = lots.find(l => l.id === id);
    setLots(prev => prev.filter(l => l.id !== id));
    
    toast({
      title: "Registro Excluído",
      description: `Lote ${lot?.lotNumber} foi removido.`,
      variant: "destructive"
    });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-elegant">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Controle de Lotes - Ribbon
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Sistema de Gestão de Problemas | Multilaser
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <RibbonLotModal onSubmit={handleCreateLot} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border shadow-card bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Registros
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Problemas cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Problemas Ativos
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolvidos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Problemas solucionados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em análise
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por lote, problema ou modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border hover:border-ring transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-border">
                  {filteredLots.length} resultado(s)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Registros de Problemas
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
    </div>
  );
}