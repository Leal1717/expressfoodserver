/*
  Warnings:

  - `nome` e `nfc_uid` da tabela `Comanda` deixam de ter unicidade global.
    Pulseiras físicas (nome/nfc_uid) são reaproveitadas entre eventos/dias, e uma
    comanda fechada (PAGA) não deveria travar o reuso do mesmo valor numa comanda
    nova. A checagem de duplicidade real (entre comandas OCUPADA/CONTA) já é feita
    na aplicação.

*/
-- DropIndex
DROP INDEX `Comanda_nfc_uid_key` ON `comanda`;

-- DropIndex
DROP INDEX `Comanda_nome_empresa_id_key` ON `comanda`;

-- CreateIndex
CREATE INDEX `Comanda_nome_empresa_id_idx` ON `Comanda`(`nome`, `empresa_id`);
