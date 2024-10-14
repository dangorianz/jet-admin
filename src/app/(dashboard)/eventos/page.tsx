import { FormCreateEvent } from "@/components/eventos/FormCreateEvent";


export default function EventsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Creacion de Eventos</h1>
      <div className="my-5 w-fit p-5 rounded-lg shadow-lg min-w-[500px] bg-white">
        <FormCreateEvent/>
      </div>
    </div>
  );
}
