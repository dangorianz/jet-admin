
import { ReporteEntradas } from '@/components/entradas/ReporteEntradas';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Divider } from '@mui/material';


export default function EntradasReportsPage() {

  return (
    <div className=" p-8">
        <h1 className="text-3xl font-bold flex items-center"><ConfirmationNumberIcon sx={{fontSize:'45px'}}/><span className='ml-2'>- Reporte de entradas</span> </h1>
        <Divider/>
        <div className=' my-5  p-5'>
            <ReporteEntradas/>
        </div>
    </div>
  );
}
