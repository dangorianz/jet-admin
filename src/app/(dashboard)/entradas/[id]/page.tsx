/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenerateQr } from "@/components/entradas/GenerateQr";
import { ButtonBack } from "@/components/layout/ButtonBack";
import { getTicketByIdService } from "@/services/ticketsService";
import _ from "lodash";

interface Props {
    params: {
        id: string
    }
}

export default async function  TicketPage({ params }: Props) {
    const { id } = params;

    const resp: any = await getTicketByIdService(id)
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold flex  items-center"> <span className="mr-5"> <ButtonBack/> </span> Detalle entrada: <span className="text-amber-900">{id}</span> </h1>
            <div className="my-5 w-fit p-5 rounded-lg shadow-lg min-w-[500px]">
                {!_.isNull(resp) &&
                    <>
                        <GenerateQr ticket={resp}/>
                        <div className="">
                            <p>
                                <span className="font-bold">Nombre:</span> {resp.cliente.nombre}
                            </p>
                            <p>
                                <span className="font-bold">Telefono:</span>  {resp.cliente.telefono}
                            </p>
                            <p>
                                <span className="font-bold">Edad:</span>  {resp.cliente.edad}
                            </p>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
