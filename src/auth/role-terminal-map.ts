import { Role, TerminalTipo } from '@prisma/client';

const TOTEM_TABLET = [TerminalTipo.AUTO_TOTEM, TerminalTipo.AUTO_TABLET]

export const ROLE_TERMINAL_MAP: Record<Role, TerminalTipo[]> = {
    [Role.OWNER]:                  [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS, ...TOTEM_TABLET],
    [Role.ADMIN_GERAL]:            [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS, ...TOTEM_TABLET],
    [Role.ADMIN_SEM_FINANCEIRO]:   [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS, ...TOTEM_TABLET],
    [Role.OPERADOR_GERAL]:         [TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS, ...TOTEM_TABLET],
    [Role.OPERADOR_SEM_ESTOQUE]:   [TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY, ...TOTEM_TABLET],
    [Role.OPERADOR_COM_FINANCEIRO]:[TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY, ...TOTEM_TABLET],
    [Role.AUTOATENDIMENTO]:        [...TOTEM_TABLET],
    [Role.CONTADOR]:               [TerminalTipo.ADM],
    [Role.MOTOBOY]:                [TerminalTipo.MOTOBOY],
};
