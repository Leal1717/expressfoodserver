/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdicionarEnderecoDto, CriarClienteRapidoDto, SalvarClienteDto } from './dto';
import { Cliente } from '@prisma/client';

@Injectable()
export class ClientesService {
        // constructor(@InjectRepository(PlanoEntity) private repository: Repository<PlanoEntity>) {}
        constructor(private prisma: PrismaService) {}
    
        async salvar(data:SalvarClienteDto) {
            const fnCliente = await this.prisma.tenantClient.cliente.create({
                data: {
                    nome: data.nome,
                    cpf: data.cpf,
                    telefone: data.telefone,
                }
            })

            const fnEndereco = await this.prisma.tenantClient.endereco.create({
                data: {
                    rua: data.endereco.rua,
                    numero: data.endereco.numero,
                    cep: data.endereco.cep,
                    bairro: data.endereco.bairro,
                    cidade: data.endereco.cidade,
                    estado: data.endereco.estado,
                    cliente: { connect: { id: fnCliente.id } },
                }
            })
            return {cliente: fnCliente, endereco: fnEndereco}
        
        }

        async adicionarEndereco(data: AdicionarEnderecoDto){
            const { cliente_id, ...rest } = data
            return this.prisma.tenantClient.endereco.create({
                data: {
                    ...rest,
                    cliente: { connect: { id: cliente_id } },
                }
            })
        }

        async removerEndereco(cliente_id: number, endereco_id: number){
            return this.prisma.tenantClient.endereco.delete({
                where: { id: endereco_id, cliente_id: cliente_id }
            })
        }
    
        async criarRapido(data: CriarClienteRapidoDto) {
            return this.prisma.tenantClient.cliente.create({
                data: { nome: data.nome, cpf: data.cpf ?? '', telefone: data.telefone ?? '' },
            })
        }

        async buscarPorCpf(cpf: string) {
            return this.prisma.tenantClient.cliente.findFirst({ where: { cpf } })
        }

        async buscarPorTelefone(telefone: string) {
            return this.prisma.tenantClient.cliente.findFirst({ where: { telefone } })
        }

        async buscarTodos() {
            return this.prisma.tenantClient.cliente.findMany()
        }
    
        async buscarPorId(id:number) {
            return this.prisma.tenantClient.cliente.findUnique({
                where: {id: Number(id)},
                include:{enderecos:true}
            })
        }
    
        async update(data:Cliente) {
            return this.prisma.tenantClient.cliente.update({where: {id: Number(data.id), data}, data: data})
        }
    
        async delete(id:number) {
            return this.prisma.tenantClient.cliente.delete({where: {id: id}})
        }
    }
    
