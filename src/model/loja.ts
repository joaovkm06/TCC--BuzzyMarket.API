import { model, Schema, Types } from 'mongoose';

export type StatusLoja =
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'bloqueada';


// ======================================================
// ENDEREÇO DA LOJA
// ======================================================

export interface EnderecoLoja {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}


// ======================================================
// HORÁRIO DE FUNCIONAMENTO
// ======================================================

export interface HorarioFuncionamento {
  abertura: string;
  fechamento: string;
}

export interface HorariosLoja {
  segunda?: HorarioFuncionamento;
  terca?: HorarioFuncionamento;
  quarta?: HorarioFuncionamento;
  quinta?: HorarioFuncionamento;
  sexta?: HorarioFuncionamento;
  sabado?: HorarioFuncionamento;
  domingo?: HorarioFuncionamento;
}


// ======================================================
// LOJA
// ======================================================

export interface Loja {
  id: string;

  nome: string;
  descricao?: string;
  categoria: string;

  // Foto de perfil/logo da loja
  foto?: string;

  // Banner da loja
  banner?: string;

  // Telefone de contato da loja
  telefone: string;

  // Endereço físico da loja
  endereco: EnderecoLoja;

  // ID do usuário que é dono da loja
  proprietarioId: Types.ObjectId;

  status: StatusLoja;

  // Horários de funcionamento da loja
  horarios: HorariosLoja;

  criadoEm: Date;
}


// ======================================================
// ENDEREÇO DA LOJA
// ======================================================

const enderecoLojaSchema = new Schema<EnderecoLoja>(
  {
    cep: {
      type: String,
      required: true,
      trim: true
    },

    logradouro: {
      type: String,
      required: true,
      trim: true
    },

    numero: {
      type: String,
      required: true,
      trim: true
    },

    complemento: {
      type: String,
      required: false,
      trim: true
    },

    bairro: {
      type: String,
      required: true,
      trim: true
    },

    cidade: {
      type: String,
      required: true,
      trim: true
    },

    estado: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false
  }
);


// ======================================================
// HORÁRIO DE FUNCIONAMENTO
// ======================================================

const horarioFuncionamentoSchema =
  new Schema<HorarioFuncionamento>(
    {
      abertura: {
        type: String,
        required: true,
        trim: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
      },

      fechamento: {
        type: String,
        required: true,
        trim: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
      }
    },
    {
      _id: false
    }
  );


// ======================================================
// HORÁRIOS DA SEMANA
// ======================================================

const horariosLojaSchema =
  new Schema<HorariosLoja>(
    {
      segunda: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      terca: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      quarta: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      quinta: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      sexta: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      sabado: {
        type: horarioFuncionamentoSchema,
        required: false
      },

      domingo: {
        type: horarioFuncionamentoSchema,
        required: false
      }
    },
    {
      _id: false
    }
  );


// ======================================================
// LOJA
// ======================================================

const lojaSchema = new Schema<Loja>(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    descricao: {
      type: String,
      trim: true
    },

    categoria: {
      type: String,
      required: true,
      trim: true
    },

    // ==================================================
    // FOTO DA LOJA
    // ==================================================

    foto: {
      type: String,
      required: false,
      trim: true
    },

    // ==================================================
    // BANNER DA LOJA
    // ==================================================

    banner: {
      type: String,
      required: false,
      trim: true
    },

    // ==================================================
    // TELEFONE
    // ==================================================

    telefone: {
      type: String,
      required: true,
      trim: true
    },

    // ==================================================
    // ENDEREÇO
    // ==================================================

    endereco: {
      type: enderecoLojaSchema,
      required: true
    },

    // ==================================================
    // PROPRIETÁRIO
    // ==================================================

    proprietarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ==================================================
    // STATUS
    // ==================================================

    status: {
      type: String,
      enum: [
        'pendente',
        'aprovada',
        'rejeitada',
        'bloqueada'
      ],
      default: 'pendente',
      required: true
    },

    // ==================================================
    // HORÁRIOS
    // ==================================================

    horarios: {
      type: horariosLojaSchema,
      required: true,
      default: {}
    }
  },

  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);


// ======================================================
// MODEL
// ======================================================

export const LojaModel = model<Loja>(
  'Loja',
  lojaSchema
);