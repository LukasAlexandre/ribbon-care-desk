export interface RibbonLot {
  id: string;
  date: string;
  time: string;
  shift: 'ADM' | '2°Turno';
  ribbonModel: string;
  quantity: number;
  problem: string;
  lotNumber: string;
  details: string;
  status: 'active' | 'resolved' | 'pending';
  createdAt: Date;
}

export interface RibbonLotFormData {
  shift: 'ADM' | '2°Turno';
  ribbonModel: string;
  quantity: number;
  problem: string;
  lotNumber: string;
  details: string;
}