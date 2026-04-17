import { Role, TerminalTipo } from '@prisma/client';

export const ROLE_TERMINAL_MAP: Record<Role, TerminalTipo[]> = {
    [Role.OWNER]:                  [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.ADMIN_GERAL]:            [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.ADMIN_SEM_FINANCEIRO]:   [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.OPERADOR_GERAL]:         [TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.OPERADOR_SEM_ESTOQUE]:   [TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.OPERADOR_COM_FINANCEIRO]:[TerminalTipo.POS, TerminalTipo.PDV, TerminalTipo.DELIVERY],
    [Role.CONTADOR]:               [TerminalTipo.ADM],
};
