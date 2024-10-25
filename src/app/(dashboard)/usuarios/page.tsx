import { Divider } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import { ReporteUsuarios } from "@/components/usuarios/ReporteUsuarios";

export default function UsersPage() {
  return (
    <div>
        <div className="p-8">
          <h1 className="text-3xl font-bold flex items-center"><PeopleIcon sx={{fontSize:'45px'}}/><span className='ml-2'>- Usuarios</span> </h1>
          <Divider/>
          <div className='my-5 p-5'>
            <ReporteUsuarios/>
          </div>
        </div>
    </div>
  );
}
