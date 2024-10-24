/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArtEvent } from "@/components/entradas/ArtEvent";
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
            <div className="my-5 w-fit rounded-lg shadow-lg">
                {!_.isNull(resp) &&
                    <div className="flex">
                        <div className="px-10 py-5">
                            <h2 className='mb-5 font-bold text-2xl text-amber-900'>{resp.cliente.nombre}</h2>
                            <GenerateQr ticket={resp} qrSize={256} downloadButton={true}/>
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

                        </div>
                        {!_.isEmpty(resp.artImageUrl) && 
                            <div>
                                <ArtEvent resp={resp}/>
                            </div>
                        }
                        
                    </div>
                }
                
                
            </div>
        </div>
    );
}
