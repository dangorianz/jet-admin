import { FormCreateTicket } from "@/components/entradas/FormCreateTicket";


export default function TicketsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Creacion de entradas</h1>
      <div className="my-5 w-fit p-5 rounded-lg shadow-lg min-w-[500px]">
        <FormCreateTicket/>
      </div>
    </div>
  );
}
