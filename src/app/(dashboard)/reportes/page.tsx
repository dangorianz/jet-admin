
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import { Divider } from '@mui/material';
import Link from 'next/link';
export default function ReportsPage() {
  return (
    <div className=" p-8">
      <h1 className="text-3xl font-bold">Lista de Reportes</h1>
      <div className="flex flex-wrap my-5">
          <Link href={'/reportes/entradas'}>
            <div className="shadow-xl bg-white rounded-xl p-4 flex flex-col min-w-[300px] min-h-[300px] m-4 cursor-pointer">
              <p className='text-2xl font-semibold text-center mb-2'>Entradas</p>
              <Divider/>
              <div className='flex-1 flex justify-center items-center'>
                <ConfirmationNumberIcon sx={{fontSize:'100px'}}  />

              </div>
            </div>
          </Link>
          <Link href={'/reportes/eventos'}>
            <div className="shadow-xl bg-white rounded-xl p-4 flex flex-col min-w-[300px] min-h-[300px] m-4 cursor-pointer">
              <p className='text-2xl font-semibold text-center mb-2'>Eventos</p>
              <Divider/>
              <div className='flex-1 flex justify-center items-center'>
                <EventIcon sx={{fontSize:'100px'}}  />

              </div>
            </div>
          </Link>

      </div>
    </div>
  );
}
