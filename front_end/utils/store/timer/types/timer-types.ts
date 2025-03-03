export interface TimerData {
    _id: string;
    name: string;
    endDate: Date;
    type : 'till' | 'from'
    userId ?: string
  }
  
  