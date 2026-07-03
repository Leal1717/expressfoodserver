import { Role, TerminalTipo } from '@prisma/client';

export const ROLE_TERMINAL_MAP: Record<Role, TerminalTipo[]> = {
    [Role.OWNER]:                  [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.TABLET, TerminalTipo.TOTEM, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS],
    [Role.ADMIN_GERAL]:            [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.TABLET, TerminalTipo.TOTEM, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS],
    [Role.ADMIN_SEM_FINANCEIRO]:   [TerminalTipo.POS, TerminalTipo.ADM, TerminalTipo.TABLET, TerminalTipo.TOTEM, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS],
    [Role.OPERADOR_GERAL]:         [TerminalTipo.POS, TerminalTipo.TABLET, TerminalTipo.TOTEM, TerminalTipo.ENTRADA, TerminalTipo.SAIDA, TerminalTipo.KDS],
    [Role.OPERADOR_SEM_ESTOQUE]:   [TerminalTipo.POS, TerminalTipo.TABLET, TerminalTipo.TOTEM],
    [Role.OPERADOR_COM_FINANCEIRO]:[TerminalTipo.POS, TerminalTipo.TABLET, TerminalTipo.TOTEM],
    [Role.AUTOATENDIMENTO]:        [TerminalTipo.TOTEM, TerminalTipo.TABLET],
    [Role.CONTADOR]:               [TerminalTipo.ADM],
    [Role.MOTOBOY]:                [TerminalTipo.MOTOBOY],
};
