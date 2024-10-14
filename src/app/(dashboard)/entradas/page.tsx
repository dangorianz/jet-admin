import { ReporteEntradas } from "@/components/entradas/ReporteEntradas";
import { Divider } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default function TicketsPage() {
  return (
    <div>
      <div className="p-8">
      <h1 className="text-3xl font-bold flex items-center"><ConfirmationNumberIcon sx={{fontSize:'45px'}}/><span className='ml-2'>- Lista de entradas</span> </h1>
        <Divider/>
        <div className='my-5 p-5'>
          <ReporteEntradas/>
        </div>
      </div>
    </div>
  );
}
