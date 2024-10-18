export interface Ticket {
    id:       string;
    cliente:  Cliente;
    createAt: string;
    evento:   string;
    estado:   string;
    precio:   string;
    usuario:  Usuario;
    sector:   string;
    artImageUrl?: string;
}

export interface Cliente {
    telefono: string;
    edad:     string;
    nombre:   string;
}

export interface Usuario {
    email:  string;
    id:     string;
    nombre: string;
}
